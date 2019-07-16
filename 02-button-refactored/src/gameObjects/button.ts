export class Button extends Entity{

    constructor(transform: TranformConstructorArgs){
        // Creating Button Entity
        super();
        engine.addEntity(this);

        // Adding Model and Transform
        this.addComponent(new GLTFShape("models/generic/redbutton.gltf"));
        this.addComponent(new Transform(transform));

        // Adding Audio
        this.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));
    }
}