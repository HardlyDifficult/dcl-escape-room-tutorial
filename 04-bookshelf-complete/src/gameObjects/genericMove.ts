import { RotateTransformComponent, MoveTransformComponent } from "../modules/transfromSystem";
import { ToggleComponent } from "../modules/toggleComponent";

export class GenericMove extends Entity{

    // Storing the Start Transform for Object
    private startTransform: Transform;
    private endPosition: Vector3;

    constructor(startTransform: TranformConstructorArgs, endPosition: Vector3){
        // Creating Entity
        super();
        engine.addEntity(this);

        // Setting Position
        this.addComponent(new Transform(startTransform));

        this.startTransform = new Transform(startTransform);
        this.endPosition = endPosition;

        // Adding Toggle Events
        this.addComponent(new ToggleComponent(ToggleComponent.State.Off, value =>{
            if(value == ToggleComponent.State.On){
                this.addComponentOrReplace(new MoveTransformComponent(this.getComponent(Transform).position, startTransform.position.add(endPosition), 0.5));
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new MoveTransformComponent(this.getComponent(Transform).position, startTransform.position, 0.5));
                this.getComponent(AudioSource).playOnce();
            }
        }));
        this.addComponent(new OnClick(event =>{
            this.getComponent(ToggleComponent).toggle();
        }))
    }
}