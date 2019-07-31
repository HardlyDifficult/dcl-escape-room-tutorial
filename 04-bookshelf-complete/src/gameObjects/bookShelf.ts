import utils from "../../node_modules/decentraland-ecs-utils/index";
import { ToggleComponent } from "../../node_modules/decentraland-ecs-utils/toggle/toggleComponent";

export class Bookshelf extends Entity{

    private startPos: Vector3;
    private endPos: Vector3;

    constructor(transform: TranformConstructorArgs, movement: Vector3){
        // Creating Entity
        super();
        engine.addEntity(this);

        // Creating Transform
        this.addComponent(new Transform(transform));

        // Setting Positional Vectors
        this.startPos = transform.position;
        this.endPos = transform.position.add(movement);

        // Adding Model and Sound
        this.addComponent(new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"));
        this.addComponent(new AudioSource(new AudioClip("sounds/move_object1.mp3")));

        // Adding Toggle Component
        this.addComponent(new utils.ToggleComponent(utils.ToggleState.Off, (value): void =>{
            // Moving Bookshelf
            if(value == utils.ToggleState.On){
                this.addComponentOrReplace(new utils.MoveTransformComponent(this.getComponent(Transform).position, this.endPos, 3));
                // Playing Audio
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new utils.MoveTransformComponent(this.getComponent(Transform).position, this.startPos, 3));
                // Playing Audio
                this.getComponent(AudioSource).playOnce();
            }
        }));
    }

    public Toggle(): void {
        this.getComponent(ToggleComponent).toggle();
    }
}