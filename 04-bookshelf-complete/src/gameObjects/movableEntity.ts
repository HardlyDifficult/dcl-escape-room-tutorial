import utils from "../../node_modules/decentraland-ecs-utils/index";

export class MovableEntity extends Entity{

    private startPos : Vector3;
    private endPos : Vector3;

     constructor(transform: TranformConstructorArgs, movement: Vector3){
        // Creating Entity
        super();
        engine.addEntity(this);

        // Creating Transform
        this.addComponent(new Transform(transform));

        // Setting Positional Vectors
        this.startPos = transform.position;
        this.endPos = transform.position.add(movement);

        // Adding Toogle Component
        this.addComponent(new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
            // Moving Entity
            if(value == utils.ToggleState.On){
                this.addComponentOrReplace(new utils.MoveTransformComponent(this.getComponent(Transform).position, this.endPos, 0.5));
                // Playing Audio
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new utils.MoveTransformComponent(this.getComponent(Transform).position, this.startPos, 0.5));
                // Playing Audio
                this.getComponent(AudioSource).playOnce();
            }
        }));

        // Adding OnClick Event
        this.addComponent(new OnClick((): void =>{
            this.getComponent(utils.ToggleComponent).toggle();
        }));
    }
}
