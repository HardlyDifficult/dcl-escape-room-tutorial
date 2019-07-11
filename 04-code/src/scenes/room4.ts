import { ToggleComponent } from "../modules/toggleComponent";
import { RotateTransformComponent } from "../modules/transfromSystem";

export function CreateRoom4(gameCanvas: UICanvas) : void{

    // Creating Wall for Keypad
    const tempWall = new Entity();
    tempWall.addComponent(new PlaneShape());
    tempWall.addComponent(new Transform({position: new Vector3(19, 1.4, 13.1), scale: new Vector3(4, 3, 1)}));
    engine.addEntity(tempWall);

    // Creating Painting
    const painting = new Entity();
    painting.addComponent(new PlaneShape());
    painting.addComponent(new Transform({position: new Vector3(18, 1.5, 13), scale: new Vector3(0.7, 1, 1), rotation: Quaternion.Euler(0, 0, 180)}));
    // Creating Material for Painting - Albedo Causing an Error
    let paintingMat = new Material();
    paintingMat.albedoTexture = new Texture("images/room4/fernpicture.png", {hasAlpha: true});
    paintingMat.hasAlpha = true;
    // Applying Material
    painting.addComponent(paintingMat);
    // ToDo OnClick Event
    engine.addEntity(painting);

    // Creating Keypad
    const keypad = new Entity();
    keypad.addComponent(new GLTFShape("models/generic/codePad.glb"));
    keypad.addComponent(new Transform({position: new Vector3(19.5, 1.5, 13)}));
    engine.addEntity(keypad);

    // Creating Carpet
    const carpet = new Entity();
    carpet.addComponent(new GLTFShape("models/room4/carpet.glb"));
    carpet.addComponent(new Transform({position: new Vector3(19,0,11)}));

    // Adding Toggle Component and OnClick Event - Toggle Not Working (Worked Before)
    carpet.addComponent(new ToggleComponent(ToggleComponent.State.Off, value=>{
        if (value == ToggleComponent.State.On){
            carpet.addComponent(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,45,0), 0.7));
        }
        else{
            carpet.addComponent(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,0,0), 0.7));
        }
    }));
    carpet.addComponent(new OnClick(event=>{
        carpet.getComponent(ToggleComponent).toggle();
    }));

    engine.addEntity(carpet);

    // Creating Coin
    const coin = new Entity();
    coin.addComponent(new GLTFShape("models/room4/coin.glb"));
    coin.addComponent(new Transform({position: new Vector3(18,0,10.5)}));
    // ToDo OnClick Event
    engine.addEntity(coin);
}
