import { ToggleComponent } from "../modules/toggleComponent";
import { MoveTransformComponent } from "../modules/transfromSystem";

export class BookShelf extends Entity{

    private startPosition: Vector3;

    constructor(transform: TranformConstructorArgs){
        // Creating Bookshelf Entity
        super();
        engine.addEntity(this);

        // Setting Position
        this.addComponent(new Transform(transform));
        this.startPosition = transform.position;

        // Adding Model and Sound
        this.addComponent(new GLTFShape("models/room4/bookshelf.glb"));
        this.addComponent(new AudioSource(new AudioClip("sounds/move_object1.mp3")));

        // Adding Toggle Event
        this.addComponent(new ToggleComponent(ToggleComponent.State.Off, value =>{
            if(value == ToggleComponent.State.On){
                this.addComponentOrReplace(new MoveTransformComponent(this.getComponent(Transform).position, this.startPosition.add(new Vector3(0,0,-1.5)),3));
                this.getComponent(AudioSource).playOnce();
            }
            else{
                this.addComponentOrReplace(new MoveTransformComponent(this.getComponent(Transform).position, this.startPosition, 3));
                this.getComponent(AudioSource).playOnce();
            }
        }));
    }

    public ToggleBookshelf(): void{
        this.getComponent(ToggleComponent).toggle();
    }
}