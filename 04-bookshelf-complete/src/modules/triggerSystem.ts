export class TriggerSystem implements ISystem{
    private _triggers: Record<string, TriggerWrapper> = {}
    private _cameraTriggerWrapper: CameraTrigger

    constructor(){
        this._cameraTriggerWrapper = new CameraTrigger(new TriggerSystem.TriggerBoxShape(new Vector3(0.5,1.8,0.5), new Vector3(0,0.91,0)))
    }

    /**
     * set a custom trigger's shape for the camera
     * @param shape custom trigger's shape
     */
    setCameraTriggerShape(shape: TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape){
        this._cameraTriggerWrapper.setShape(shape)
    }

    update(){
        //get entities with trigger component
        let entitiesWithTriggers = engine.getComponentGroup(TriggerSystem.TriggerComponent).entities

        //iterate through all entities with triggers and wrap entities that weren't wrapped yet
        entitiesWithTriggers.forEach(entity => {
            if (this.shouldWrapTriggerEntity(entity)){
                this.wrapTriggerEntity(entity)
            }
        });
        
        //iterate through wrapped entities
        for (const key in this._triggers){
            if (this._triggers.hasOwnProperty(key)){
                let wrapper = this._triggers[key]

                //update debug entity
                if (wrapper.isDebugging()){
                    wrapper.updateDebugEntity()
                }

                if (!wrapper.isInEngine()){
                    //remove debugging
                    if (wrapper.isDebugging()){
                        wrapper.removeDebugEntity()
                    }
                    //remove old collisions
                    TriggerSystem.removeTriggerFromSystem(wrapper)
                    //remove from record
                    delete this._triggers[key]
                }
                else if (wrapper.trigger.enabled){
                    //if was set as enabled in last frame
                    if (!wrapper.wasEnabled){
                        if (wrapper.isDebugging()){
                            wrapper.addDebugEntity()
                        }
                    }
                    //set as enabled
                    wrapper.wasEnabled = true

                    //check collision camera
                    if (wrapper.trigger.onCameraEnter || wrapper.trigger.onCameraExit){
                        this.checkCollisionAgainstCamera(wrapper)
                    }

                    //check collision with others
                    if (wrapper.trigger.onTriggerEnter || wrapper.trigger.onTriggerExit){
                        this.checkCollisionAgainstOtherTriggers(wrapper)
                    }
                }
                else if (wrapper.wasEnabled){
                    wrapper.wasEnabled = false
                    //remove debugging
                    if (wrapper.isDebugging()){
                        wrapper.removeDebugEntity()
                    }
                    TriggerSystem.removeTriggerFromSystem(wrapper)
                }
            }
        }

    }

    private shouldWrapTriggerEntity(entity: IEntity): boolean{
        return this._triggers[entity.uuid] == undefined || this._triggers[entity.uuid] == null
    }

    private wrapTriggerEntity(entity: IEntity){
        this._triggers[entity.uuid] = new TriggerWrapper(entity)
    }

    private static removeTriggerFromSystem(wrapper: TriggerWrapper){
        let activeCollisions = wrapper.getActiveCollisions()
        for (let i=0; i<activeCollisions.length; i++){
            if (activeCollisions[i].trigger.onTriggerExit) activeCollisions[i].trigger.onTriggerExit(wrapper.entity)
            activeCollisions[i].disengageActiveCollision(wrapper)
            wrapper.disengageActiveCollision(activeCollisions[i])
        }
    }

    private static disengageCollision(t1: TriggerWrapper, t2: TriggerWrapper){
        t1.disengageActiveCollision(t2)
        t2.disengageActiveCollision(t1)

        if (t1.trigger.onTriggerExit)t1.trigger.onTriggerExit(t2.entity)
        if (t2.trigger.onTriggerExit)t2.trigger.onTriggerExit(t1.entity)
    }

    private static engageCollision(t1: TriggerWrapper, t2: TriggerWrapper){
        t1.engageCollision(t2)
        t2.engageCollision(t1)

        if (t1.trigger.onTriggerEnter)t1.trigger.onTriggerEnter(t2.entity)
        if (t2.trigger.onTriggerEnter)t2.trigger.onTriggerEnter(t1.entity)
    }

    private checkCollisionAgainstCamera(wrapper: TriggerWrapper){
        let wereColliding = wrapper.hasActiveCollision(this._cameraTriggerWrapper)
        let areColliding = TriggerSystem.areColliding(wrapper, this._cameraTriggerWrapper)

        if (wereColliding && !areColliding){
            wrapper.disengageActiveCollision(this._cameraTriggerWrapper)
            if (wrapper.trigger.onCameraExit) wrapper.trigger.onCameraExit()
        }
        else if (!wereColliding && areColliding){
            wrapper.engageCollision(this._cameraTriggerWrapper)
            if (wrapper.trigger.onCameraEnter) wrapper.trigger.onCameraEnter()
        }
    }

    private checkCollisionAgainstOtherTriggers(wrapper: TriggerWrapper){
        for (const key in this._triggers){
            if (this._triggers.hasOwnProperty(key)){
                if (key != wrapper.uuid && this._triggers[key].trigger.enabled){
                    if (TriggerSystem.canTriggersCollide(wrapper, this._triggers[key])){
                        let wereColliding = wrapper.hasActiveCollision(this._triggers[key])
                        let areColliding = TriggerSystem.areColliding(wrapper, this._triggers[key])

                        if (wereColliding && !areColliding) TriggerSystem.disengageCollision(wrapper, this._triggers[key])
                        else if (!wereColliding && areColliding) TriggerSystem.engageCollision(wrapper, this._triggers[key])
                    }
                }
            }
        }        
    }

    private static canTriggersCollide(t1: TriggerWrapper, t2: TriggerWrapper): boolean{
        if (t1.trigger.triggeredByLayer == 0) return true
        return (t2.trigger.layer & t1.trigger.triggeredByLayer) != 0
    }

    private static areColliding(t1: TriggerWrapper, t2: TriggerWrapper): boolean{
        if (t1.getShape() instanceof TriggerSystem.TriggerBoxShape && t2.getShape() instanceof TriggerSystem.TriggerBoxShape){
            return TriggerSystem.areCollidingAABB(t1.getGlobalPosition(),t1.getShape() as TriggerSystem.TriggerBoxShape,t2.getGlobalPosition(),t2.getShape() as TriggerSystem.TriggerBoxShape)
        }
        else if (t1.getShape() instanceof TriggerSystem.TriggerSphereShape && t2.getShape() instanceof TriggerSystem.TriggerSphereShape){
            return TriggerSystem.areCollidingSphere(t1.getGlobalPosition(),t1.getShape() as TriggerSystem.TriggerSphereShape ,t2.getGlobalPosition(),t2.getShape() as TriggerSystem.TriggerSphereShape)
        }
        else if (t1.getShape() instanceof TriggerSystem.TriggerBoxShape && t2.getShape() instanceof TriggerSystem.TriggerSphereShape){
            return TriggerSystem.areCollidingAABBSphere(t1.getGlobalPosition(),t1.getShape() as TriggerSystem.TriggerBoxShape,t2.getGlobalPosition(),t2.getShape() as TriggerSystem.TriggerSphereShape)
        }
        else if (t1.getShape() instanceof TriggerSystem.TriggerSphereShape && t2.getShape() instanceof TriggerSystem.TriggerBoxShape){
            return TriggerSystem.areCollidingAABBSphere(t2.getGlobalPosition(),t2.getShape() as TriggerSystem.TriggerBoxShape,t1.getGlobalPosition(),t1.getShape() as TriggerSystem.TriggerSphereShape)
        }
        return false
    }

    private static areCollidingAABB(t1GlobalPosition: Vector3, t1Shape: TriggerSystem.TriggerBoxShape, t2GlobalPosition: Vector3, t2Shape: TriggerSystem.TriggerBoxShape): boolean{
        let t1 = TriggerSystem.getBoxShapeValues(t1GlobalPosition,t1Shape)
        let t2 = TriggerSystem.getBoxShapeValues(t2GlobalPosition,t2Shape)
        return (t1.min.x <= t2.max.x && t1.max.x >= t2.min.x) && (t1.min.y <= t2.max.y && t1.max.y >= t2.min.y) && (t1.min.z <= t2.max.z && t1.max.z >= t2.min.z)
    }

    private static areCollidingSphere(t1GlobalPosition: Vector3, t1Shape: TriggerSystem.TriggerSphereShape, t2GlobalPosition: Vector3, t2Shape: TriggerSystem.TriggerSphereShape): boolean{
        let sqDist = Vector3.DistanceSquared(t1GlobalPosition.add(t1Shape.position), t2GlobalPosition.add(t2Shape.position))
        return sqDist < (t1Shape.radius * t1Shape.radius) + (t2Shape.radius * t2Shape.radius)
    }

    private static areCollidingAABBSphere(t1GlobalPosition: Vector3, t1Shape: TriggerSystem.TriggerBoxShape, t2GlobalPosition: Vector3, t2Shape: TriggerSystem.TriggerSphereShape): boolean{
        let box = TriggerSystem.getBoxShapeValues(t1GlobalPosition, t1Shape)
        let sphere = {center: t2GlobalPosition.add(t2Shape.position), radius: t2Shape.radius}

        let dmin = 0;
        if(sphere.center.x < box.min.x) dmin += (box.min.x - sphere.center.x) * (box.min.x - sphere.center.x)
        if(sphere.center.x > box.max.x) dmin += (sphere.center.x - box.max.x) * (sphere.center.x - box.max.x)
        if(sphere.center.y < box.min.y) dmin += (box.min.y - sphere.center.y) * (box.min.y - sphere.center.y)
        if(sphere.center.y > box.max.y) dmin += (sphere.center.y - box.max.y) * (sphere.center.y - box.max.y)
        if(sphere.center.z < box.min.z) dmin += (box.min.z - sphere.center.z) * (box.min.z - sphere.center.z)
        if(sphere.center.z > box.max.z) dmin += (sphere.center.z - box.max.z) * (sphere.center.z - box.max.z)

        return dmin < sphere.radius * sphere.radius
    }

    private static getBoxShapeValues(entityGlobalPosition: Vector3, shape : TriggerSystem.TriggerBoxShape): {center: Vector3, min: Vector3, max: Vector3}{
        let center = entityGlobalPosition.add(shape.position) 
        return {
            center: center,
            min: center.subtract(shape.size.scale(0.5)), 
            max: center.add(shape.size.scale(0.5))
        }
    }
}

class TriggerWrapper{
    wasEnabled: boolean = true

    get entity(): IEntity {return this._entity}
    get trigger(): TriggerSystem.TriggerComponent {return this._trigger}
    get uuid(): string {return this._uuid}

    protected _entity: IEntity = null
    protected _trigger: TriggerSystem.TriggerComponent
    protected _uuid: string
    protected _collidingWith: Record<string,TriggerWrapper> = {}

    private _isDebug: boolean = false
    private _debugEntity: Entity = null
    private static _debugMaterial: Material = null

    constructor(entity: IEntity){
        this._entity = entity
        if (entity){
            this._trigger = entity.getComponent(TriggerSystem.TriggerComponent)
            this._uuid = entity.uuid
            this._isDebug = this._trigger.debugEnabled
            if (this._isDebug){
                this.addDebugEntity()
            }
        }
    }
    
    getGlobalPosition(): Vector3{
        return TriggerWrapper.getEntityWorldPosition(this._entity)
    }

    getShape(): TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape{
        return this._trigger.shape
    }

    isInEngine(): boolean{
        return this._entity != null && this._entity.isAddedToEngine()
    }

    getActiveCollisions(): TriggerWrapper[]{
        let ret: TriggerWrapper[] = []

        for (const key in this._collidingWith){
            if (this._collidingWith.hasOwnProperty(key)){
                ret.push(this._collidingWith[key])
            }
        }  
        return ret
    }

    hasActiveCollision(other: TriggerWrapper): boolean{
        return this._collidingWith[other.uuid] != undefined && this._collidingWith[other.uuid] != null
    }

    disengageActiveCollision(other: TriggerWrapper){
        delete this._collidingWith[other.uuid]
    }

    engageCollision(other: TriggerWrapper){
        this._collidingWith[other.uuid] = other
    }

    isDebugging(): boolean{
        return this._isDebug
    }

    addDebugEntity(){
        if (!TriggerWrapper._debugMaterial){
            TriggerWrapper._debugMaterial = new Material()
            TriggerWrapper._debugMaterial.hasAlpha = true
            TriggerWrapper._debugMaterial.alpha = 0.5
        }

        if (this._debugEntity == null){
            this._debugEntity = new Entity()

            const transform = new Transform()
            this._debugEntity.addComponent(transform)
            this._debugEntity.addComponent(TriggerWrapper._debugMaterial)
            
            if (this.getShape() instanceof TriggerSystem.TriggerBoxShape){
                const shape = new BoxShape()
                shape.withCollisions = false
                this._debugEntity.addComponent(shape)
                transform.scale = (this.getShape() as TriggerSystem.TriggerBoxShape).size
            }
            if (this.getShape() instanceof TriggerSystem.TriggerSphereShape){
                const shape = new SphereShape()
                shape.withCollisions = false
                this._debugEntity.addComponent(shape)
                let rad = (this.getShape() as TriggerSystem.TriggerSphereShape).radius
                transform.scale = new Vector3(rad,rad,rad)
            }
        }
        engine.addEntity(this._debugEntity)
    }

    removeDebugEntity(){
        engine.removeEntity(this._debugEntity)
    }

    updateDebugEntity(){
        if (this._debugEntity){
            this._debugEntity.getComponent(Transform).position = this.getGlobalPosition().add(this.getShape().position)
        }
    }

    private static getEntityWorldPosition(entity: IEntity): Vector3{
        let entityPosition = entity.hasComponent(Transform)? entity.getComponent(Transform).position : Vector3.Zero()
        let parentEntity = entity.getParent()

        if (parentEntity != null){
            let parentRotation = parentEntity.hasComponent(Transform)? parentEntity.getComponent(Transform).rotation : Quaternion.Identity
            return this.getEntityWorldPosition(parentEntity).add(entityPosition.rotate(parentRotation))
        }
        return entityPosition
    }
}

class CameraTrigger extends TriggerWrapper{
    private _shape: TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape

    constructor(shape: TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape){
        super(null)
        this._shape = shape
        this._uuid = "cameraTrigger"
    }

    getGlobalPosition(){
        return Camera.instance.position
    }

    getShape(){
        return this._shape
    }

    setShape(shape: TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape){
        this._shape = shape
    }

    isInEngine(): boolean{
        return false
    }

    hasActiveCollision(other: TriggerWrapper): boolean{
        return false
    }

    disengageActiveCollision(other: TriggerWrapper){
    }

    engageCollision(other: TriggerWrapper){
    }
    isDebugging(): boolean{
        return false
    }
}

export namespace TriggerSystem{

    @Component("triggerComponent")
    export class TriggerComponent{
        /**
         * is trigger enable?
         */
        enabled : boolean = true
        /**
         * shape of the collider
         */
        shape : TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape
        /**
         * byte layer of the Tigger (usefull to discriminate between trigger events)
         */
        layer : number = 0
        /**
         * against which layer are we going to check trigger's collisions
         */
        triggeredByLayer: number = 0
        /**
         * callback when trigger is entered
         */
        onTriggerEnter? : (entity: IEntity) => void
        /**
         * callback when trigger is exit
         */
        onTriggerExit? : (entity: IEntity) => void
        /**
         * callback when trigger is entered
         */
        onCameraEnter? : () => void
        /**
         * callback when trigger is exit
         */
        onCameraExit? : () => void
        /**
         * get if debug is enabled
         */
        get debugEnabled() : boolean {return this._debugEnabled}

        private _debugEnabled: boolean

        constructor(shape: TriggerSystem.TriggerBoxShape | TriggerSystem.TriggerSphereShape, layer: number= 0, triggeredByLayer: number= 0, 
            onTriggerEnter?:(entity: Entity)=>void, onTriggerExit?:(entity: Entity)=>void, onCameraEnter?:()=>void, onCameraExit?:()=>void, enableDebug: boolean = false){
                this.shape = shape
                this.layer = layer
                this.triggeredByLayer = triggeredByLayer
                this.onTriggerEnter = onTriggerEnter
                this.onTriggerExit = onTriggerExit
                this.onCameraEnter = onCameraEnter
                this.onCameraExit = onCameraExit
                this._debugEnabled = enableDebug
        }
    }

    export class TriggerBoxShape{
        size: Vector3
        position: Vector3

        constructor(size: Vector3, position: Vector3){
            this.size = size
            this.position = position
        }
    }

    export class TriggerSphereShape{
        radius: number
        position: Vector3

        constructor(radius: number, position: Vector3){
            this.radius = radius
            this.position = position
        }
    }

}