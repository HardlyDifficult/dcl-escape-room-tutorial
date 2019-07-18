import { ToggleComponent } from "../modules/toggleComponent";
import { RotateTransformComponent } from "../modules/transfromSystem";

export class Chanderlier extends Entity{

    private startRotation: Quaternion;

    constructor(transform: TranformConstructorArgs){
        // Creating Candlestick Holder Entity
        super();
        engine.addEntity(this);

        // Setting Position
        this.addComponent(new Transform(transform));
        this.startRotation = transform.rotation;

        // Adding Model and Sound
        this.addComponent(new GLTFShape("models/room4/chandelier.glb"));
        this.addComponent(new AudioSource(new AudioClip("sounds/move_object1.mp3")));

        // Adding Toggle Event
        this.addComponent(new ToggleComponent(ToggleComponent.State.Off, value =>{
            if(value == ToggleComponent.State.On){
                this.addComponentOrReplace(new RotateTransformComponent(this.getComponent(Transform).rotation, Quaternion.Euler(0,0,-30), 0.5));
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new RotateTransformComponent(this.getComponent(Transform).rotation, this.startRotation, 0.5));
                this.getComponent(AudioSource).playOnce();
            }
        }));
    }

    public ToggleChanderlier(): void{
        this.getComponent(ToggleComponent).toggle();
    }
}