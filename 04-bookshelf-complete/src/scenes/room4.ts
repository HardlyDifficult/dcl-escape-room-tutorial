import {MovableEntity} from "../gameObjects/movableEntity";
import {RotatableEntity} from "../gameObjects/rotatableEntity";
import {Bookshelf} from "../gameObjects/bookshelf";
import {CandleHolder} from "../gameObjects/candleHolder";

export function CreateRoom4(): void{

    // Importing Audio Clips
    let audioMoveObject1 = new AudioClip("sounds/move_object1.mp3");
    let audioMoveObject2 = new AudioClip("sounds/move_object2.mp3");

    // Creating Bookshelf
    let bookshelf = new Bookshelf(new Transform({
        position: new Vector3(20.6557,5.4996,15.041),
        rotation: Quaternion.Identity
    }), 
    new Vector3(1.5,0,0));

    // Creating CandleHolder
    let candleHolder = new CandleHolder(new Transform({
        position: new Vector3(17.5056,7.61611,15.3835),
        rotation: Quaternion.Identity
    }),
    Quaternion.Euler(0,0,30));

    // Adding OnClick Event
    candleHolder.addComponent(new OnClick((): void =>{
        candleHolder.Toggle();
        bookshelf.Toggle();
    }))

    // -- Background Objects -- //

    // Creating First Book
    let book1 = new RotatableEntity(new Transform({
        position: new Vector3(15.8321,7.83095,14.1252),
        rotation: Quaternion.Identity
    }),
    Quaternion.Euler(0,0,-25));

    // Adding Model and Sound
    book1.addComponent(new GLTFShape("models/room4/Puzzle04_Book1.glb"));
    book1.addComponent(new AudioSource(audioMoveObject1));

    // Creating Telescope
    let telescope  = new RotatableEntity(new Transform({
        position: new Vector3(22.6554,7.02615,10.6208),
        rotation: Quaternion.Identity,
    }),
    Quaternion.Euler(0,127,0));

    // Adding Model and Sound
    telescope.addComponent(new GLTFShape("models/room4/Puzzle04_Telescope.glb"));
    telescope.addComponent(new AudioSource(audioMoveObject1));

    // Creating Second Book
    let book2 = new MovableEntity(new Transform({
        position: new Vector3(20.41,6.4118,10.4922)
    }),
    new Vector3(0,0,-0.2));

    // Adding Model and Sound
    book2.addComponent(new GLTFShape("models/room4/Puzzle04_Book2.glb"));
    book2.addComponent(new AudioSource(audioMoveObject1));

    // Creating Wine Glass
    let wineGlass = new MovableEntity(new Transform({
        position: new Vector3(25.7505,6.95786,10.5917)
    }),
    new Vector3(0.2,0,0));

    // Adding Model and Sound
    wineGlass.addComponent(new GLTFShape("models/room4/Puzzle04_WGlass.glb"));
    wineGlass.addComponent(new AudioSource(audioMoveObject2));

    // Creating Globe
    let globe = new RotatableEntity(new Transform({
        position: new Vector3(21.2191,7.11234,10.6817),
        rotation: Quaternion.Euler(0.146,34.9,-33.8)
    }), 
    Quaternion.Euler(174, -26.43, -149.37));

    // Adding Model and Sound
    globe.addComponent(new GLTFShape("models/room4/Puzzle04_Globe.glb"));
    globe.addComponent(new AudioSource(audioMoveObject1));
}