export class ParticleSystem implements ISystem{
    private config: ParticleSystem.IEmitterConfig
    private availableParticles: ParticleInstance[] = []
    private aliveParticles: ParticleInstance[] = []
    private isRunning: boolean = false
    private runningTime: number
    private delayTime: number
    private timeForNextSpawn: number
    private emitterPosition: Vector3 = Vector3.Zero()
    private parent: Entity = null

    constructor(config: ParticleSystem.IEmitterConfig){
        this.config = config
        this.createParticles(config)
    }

    /**
     * Starts particle system
     */
    start(){
        this.isRunning = true
        this.delayTime = this.config.startDelay
        this.timeForNextSpawn = 0
        this.runningTime = 0
    }

    /**
     * Stop particle system
     */
    stop(){
        this.isRunning = false
    }

    /**
     * Get if particle system is running
     */
    running(): boolean{
        return this.isRunning
    }

    /**
     * Set a Transform as parent of the particle system
     * @param parent 
     */
    setParent(parent: Entity){
        this.parent = parent
    }

    set position(value: Vector3){
        this.emitterPosition = value
    }

    get position() : Vector3{
        if (this.parent != null){
            return this.getEntityWorldPosition(this.parent).add(this.emitterPosition.rotate(this.parent.getComponent(Transform).rotation))
        }
        return this.emitterPosition
    }

    update(dt: number){
        if (this.isRunning){
            if (this.delayTime > 0){
                this.delayTime -= dt
            }
            else{
                this.runningTime += dt
                this.timeForNextSpawn -= dt
                if (this.timeForNextSpawn <= 0){
                    if (this.config.particleSpawnInterval <=0){
                        while(this.spawnParticle()){}
                    }
                    else if (this.spawnParticle()){
                        this.timeForNextSpawn = this.config.particleSpawnInterval
                    }
                }
                if (this.runningTime > this.config.duration && !this.config.loop){
                    this.stop()
                }
            }
        }
        for (let i=this.aliveParticles.length-1; i>=0; i--){
            let particleInstance = this.aliveParticles[i]
            particleInstance.particleComponent.update(dt)
            if (!particleInstance.particleComponent.shouldBeAlive()){
                this.removeParticle(i)
            }
        }
    }

    private createParticles(config: ParticleSystem.IEmitterConfig){
        for (let i=0; i<config.maxParticles; i++){
            let entity = new Entity()
            let transform = new Transform()
            let particleProperties = new ParticleSystem.ParticleProperties(transform, this)

            entity.addComponent(new Billboard())
            entity.addComponent(new PlaneShape())
            entity.addComponent(transform)

            let particle = new ParticleComponent(entity, config.particlesBehavior, particleProperties, config.particleLifeTime)

            this.availableParticles.push({particleComponent:particle, particleEntity:entity})
        }
    }

    private spawnParticle() : boolean{
        if (this.availableParticles.length > 0){
            let particleInstance = this.availableParticles[0]
            this.availableParticles.splice(0,1)
            particleInstance.particleComponent.spawn(this.getSpawnPosition())
            this.aliveParticles.push(particleInstance)
            if (!particleInstance.particleEntity.isAddedToEngine()){
                engine.addEntity(particleInstance.particleEntity)
            }
            return true
        }
        return false
    }

    private removeParticle(particleIndex: number){
        let particleInstance = this.aliveParticles[particleIndex]
        this.aliveParticles.splice(particleIndex, 1)
        this.availableParticles.push(particleInstance)
        if (particleInstance.particleEntity.isAddedToEngine()){
            engine.removeEntity(particleInstance.particleEntity)
        }
    }

    private getSpawnPosition() : Vector3{        
        let getSpawnInIndex = (indexSize) =>{
            if (indexSize == 0) return 0
            else{
                let sign = Math.random() < 0.5? 1 : -1
                return Math.random() * indexSize * sign
            }
        }
        let spawnOffet = Vector3.Zero()
        spawnOffet.x = getSpawnInIndex(this.config.sourceSize.x)
        spawnOffet.y = getSpawnInIndex(this.config.sourceSize.y)
        spawnOffet.z = getSpawnInIndex(this.config.sourceSize.z)
        return this.position.add(spawnOffet)
    }

    private getEntityWorldPosition(entity: IEntity) : Vector3{
        if (entity.hasComponent(Transform)){
            if (entity.getParent() != null){
                let parent = entity.getParent()
                if (parent.hasComponent(Transform)){
                    return this.getEntityWorldPosition(parent).add(entity.getComponent(Transform).position.rotate(parent.getComponent(Transform).rotation))
                }
            }
            return entity.getComponent(Transform).position
        }
        return Vector3.Zero()
    }
}

export namespace ParticleSystem{

    /**
     * Interface to configure particle system emitter
     */
    export interface IEmitterConfig{
        /**
         * duration of the particle system
         */
        duration: number
        /**
         * set particle system to loop
         */
        loop: boolean
        /**
         * max amount of particles at the same time
         */
        maxParticles: number
        /**
         * set a delay between starting the system and particles beginning to spawn
         */
        startDelay: number
        /**
         * emitter source size. Are particles going to spawn from the center (Vector3.Zero()) or in an area arround the center?
         */
        sourceSize: Vector3
        /**
         * interval (in seconds) between particles spawn
         */
        particleSpawnInterval: number
        /**
         * how much seconds will the particle live
         */
        particleLifeTime: number
        /**
         * set a behavior for particles
         */
        particlesBehavior: IParticlesBehavior
    }

    /**
     * Class holding the properties of a specific particle
     */
    export class ParticleProperties {
        private transform : Transform
        private material : Material
        private velocity : Vector3 = Vector3.Zero()
        private emiterSystem: ParticleSystem
        private bundle : any

        /**
         * 
         * @param transform transform of the particle entity
         * @param emiterSystem system creating this particle
         */
        constructor(transform: Transform, emiterSystem: ParticleSystem){
            this.transform = transform
            this.emiterSystem = emiterSystem
        }

        /**
         * set particle position
         * @param position 
         */
        setPosition(position: Vector3){
            this.transform.position = position
        }

        /**
         * get particle position
         */
        getPosition(): Vector3{
            return this.transform.position
        }

        /**
         * set particle rotation
         * @param rotation 
         */
        setRotation(rotation: Quaternion){
            this.transform.rotation = rotation
        }

        /**
         * get particle rotation
         */
        getRotation(): Quaternion{
            return this.transform.rotation
        }

        /**
         * set particle scale
         * @param scale 
         */
        setScale(scale: Vector3){
            this.transform.scale = scale
        }

        /**
         * get particle scale
         */
        getScale(): Vector3{
            return this.transform.scale
        }

        /**
         * set particle velocity
         * @param velocity 
         */
        setVelocity(velocity: Vector3){
            this.velocity = velocity
        }

        /**
         * get particle velocity
         */
        getVelocity(): Vector3{
            return this.velocity
        }

        /**
         * get particle material
         */
        getMaterial(): Material{
            return this.material
        }

        /**
         * set color to particle material
         * @param color 
         */
        setColor(color: Color4){
            if (this.material != null){
                this.material.albedoColor = new Color3(color.r, color.g, color.b)
                if (this.material.hasAlpha) this.material.alpha = color.a
            }
        }

        /**
         * set alpha value to particle material
         * @param alpha alpha value
         */
        setAlpha(alpha: number){
            if (this.material != null){
                if (this.material.hasAlpha) this.material.alpha = alpha
            }            
        }

        /**
         * set material to particle (it must be added to the entity first)
         * @param material 
         */
        setMaterial(material: Material){
            this.material = material
        }

        /**
         * set a bundle for this particle
         * @param bundle 
         */
        setBundle(bundle){
            this.bundle = bundle
        }

        /**
         * get particle's bundle
         */
        getBundle(): any{
            return this.bundle
        }

        /**
         * get current emitter position
         */
        getEmitterPosition(): Vector3{
            return this.emiterSystem.position
        }
    }

    /**
     * Interface for particles behavior
     */
    export interface IParticlesBehavior{
        onCreate(particleEntity: Readonly<Entity>, properties: Readonly<ParticleProperties>)
        onSpawn(properties: Readonly<ParticleProperties>)
        onUpdate(properties: Readonly<ParticleProperties>, lifeTimeRatio: number)
    }

    /**
     * Basic particle behavior for simple particle systems
     */
    export class BasicParticlesBehavior implements IParticlesBehavior{
        /**
         * particles' starting velocity
         */
        startVelocity: Vector3
        /**
         * particles' ending velocity
         */
        endVelocity: Vector3 = null
        /**
         * particles' starting scale
         */
        startScale: Vector3 = null
        /**
         * particles' ending scale
         */
        endScale: Vector3 = null
        /**
         * particles' starting rotation
         */
        startRotation: Quaternion = null
        /**
         * particles' ending rotation
         */
        endRotation: Quaternion = null
        /**
         * particles' material
         */
        material: Material

        /**
         * 
         * @param material that is going to be used by the particles
         * @param startVelocity starting velocity
         * @param startRotation starting rotation
         * @param startScale starting scale
         * @param endVelocity ending velocity
         * @param endRotation ending rotation
         * @param endScale ending scale
         */
        constructor(material: Material, startVelocity?: Vector3, startRotation?: Quaternion, startScale?: Vector3,
        endVelocity?: Vector3, endRotation?: Quaternion, endScale?: Vector3){
            this.startVelocity = startVelocity
            this.endVelocity = endVelocity
            this.startScale = startScale
            this.endScale = endScale 
            this.material = material
            this.startRotation = startRotation
            this.endRotation = endRotation
        }

        onCreate(particleEntity: Readonly<Entity>, properties: Readonly<ParticleProperties>){
            if (this.startVelocity == null) this.startVelocity = Vector3.Zero()
            if (this.startRotation == null) this.startRotation = Quaternion.Identity
            if (this.startScale == null) this.startScale = Vector3.One()
            particleEntity.addComponent(this.material)
            properties.setMaterial(this.material)
        }

        onSpawn(properties: Readonly<ParticleProperties>){
            properties.setVelocity(this.startVelocity)
            properties.setRotation(this.startRotation)
            properties.setScale(this.startScale)
        }

        onUpdate(properties: Readonly<ParticleProperties>, lifeTimeRatio: number){
            this.updateVelocity(properties, lifeTimeRatio)
            this.updateRotatio(properties, lifeTimeRatio)
            this.updateScale(properties, lifeTimeRatio)
        }

        private updateVelocity(properties: Readonly<ParticleProperties>, lifeTimeRatio: number){
            if (this.endVelocity != null){
                properties.setVelocity(Vector3.Lerp(this.startVelocity, this.endVelocity, lifeTimeRatio))
            }
        }
        private updateRotatio(properties: Readonly<ParticleProperties>, lifeTimeRatio: number){
            if (this.endRotation != null){
                properties.setRotation(Quaternion.Slerp(this.startRotation, this.endRotation, lifeTimeRatio))
            }
        }
        private updateScale(properties: Readonly<ParticleProperties>, lifeTimeRatio: number){
            if (this.endScale != null){
                properties.setScale(Vector3.Lerp(this.startScale, this.endScale, lifeTimeRatio))
            }
        }
    }
}

Component("particleComponent")
class ParticleComponent{
    private particleBehavior: ParticleSystem.IParticlesBehavior
    private particleProperties: Readonly<ParticleSystem.ParticleProperties>
    private particleAliveTime: number = 0
    private particleLifeTime: number

    constructor(particleEntity: Readonly<Entity>, particleBehavior: Readonly<ParticleSystem.IParticlesBehavior>, 
    particleProperties:Readonly<ParticleSystem.ParticleProperties>, particleLifeTime: number){
        this.particleBehavior = particleBehavior
        this.particleProperties = particleProperties
        this.particleLifeTime = particleLifeTime
        particleBehavior.onCreate(particleEntity, particleProperties)
        this.reset()
    }

    spawn(position: Vector3){
        this.particleProperties.setPosition(position)
        this.particleBehavior.onSpawn(this.particleProperties)
        this.reset()
    }

    update(dt: number){
        this.particleAliveTime += dt
        let lifeTimeRatio = Scalar.Clamp(this.particleAliveTime / this.particleLifeTime, 0, 1)
        this.particleProperties.setPosition(this.particleProperties.getPosition().add(this.particleProperties.getVelocity().scale(dt)))
        this.particleBehavior.onUpdate(this.particleProperties, lifeTimeRatio)
    }

    reset(){
        this.particleAliveTime = 0
    }

    shouldBeAlive(): boolean{
        return this.particleAliveTime < this.particleLifeTime
    }
}

class ParticleInstance{
    particleComponent: ParticleComponent
    particleEntity: Entity
}