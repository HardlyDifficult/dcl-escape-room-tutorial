// Switch the import to use the index
import { Door } from "../gameObjects/index";
import resources from "../resources";

export function CreateRoom1(): void {
  const door = new Door(
    resources.models.door1,
    { position: new Vector3(21.18, 10.8, 24.5) },
    resources.sounds.doorSqueak
  );

  door.addComponent(
    new OnClick((): void => {
      door.openDoor();
    })
  );
}
