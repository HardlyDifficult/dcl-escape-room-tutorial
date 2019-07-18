import { RotateTransformComponent, MoveTransformComponent } from "../modules/transfromSystem";
import { ToggleComponent } from "../modules/toggleComponent";

export class GenericRotate extends Entity{

    // Storing the Start Transform for Object
    private startTransform: Transform;
    private endRotation: Quaternion;

    constructor(startTransform: TranformConstructorArgs, endRotation: Quaternion){
        // Creating Entity
        super();
        engine.addEntity(this);

        // Setting Position
        this.addComponent(new Transform(startTransform));

        this.startTransform = new Transform(startTransform);
        this.endRotation = endRotation;

        // Adding Toggle Events
        this.addComponent(new ToggleComponent(ToggleComponent.State.Off, value =>{
            if(value == ToggleComponent.State.On){
                this.addComponentOrReplace(new RotateTransformComponent(this.getComponent(Transform).rotation, endRotation, 0.5));
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new RotateTransformComponent(this.getComponent(Transform).rotation, startTransform.rotation, 0.5));
                this.getComponent(AudioSource).playOnce();
            }
        }));
        this.addComponent(new OnClick(event =>{
            this.getComponent(ToggleComponent).toggle();
        }))
    }
}