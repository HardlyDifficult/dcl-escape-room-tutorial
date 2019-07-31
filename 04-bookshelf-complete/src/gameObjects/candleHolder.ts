import utils from "../../node_modules/decentraland-ecs-utils/index";
import { ToggleComponent } from "../../node_modules/decentraland-ecs-utils/toggle/toggleComponent";

export class CandleHolder extends Entity{

    private startRot: Quaternion;
    private endRot: Quaternion;

    constructor(transform: TranformConstructorArgs, rotation: Quaternion){
        // Creating Entity
        super();
        engine.addEntity(this);

        // Creating Transform
        this.addComponent(new Transform(transform));

        // Setting Rotational Vectors
        this.startRot = transform.rotation;
        this.endRot = rotation;

        // Adding Model and Sound
        this.addComponent(new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"));
        this.addComponent(new AudioSource(new AudioClip("sounds/move_object2.mp3")));

        this.addComponent(new utils.ToggleComponent(utils.ToggleState.Off, (value): void =>{
            // Rotating Entity
            if(value == utils.ToggleState.On){
                this.addComponentOrReplace(new utils.RotateTransformComponent(this.getComponent(Transform).rotation, this.endRot, 0.5));
                // Playing Sound
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new utils.RotateTransformComponent(this.getComponent(Transform).rotation, this.startRot, 0.5));
                // Playing Sound
                this.getComponent(AudioSource).playOnce();
            }
        }));
    }

    public Toggle(): void{
        this.getComponent(ToggleComponent).toggle();
    }
}