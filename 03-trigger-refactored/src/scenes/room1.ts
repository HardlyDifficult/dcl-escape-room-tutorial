// Move the door logic to a separate gameObject file
import { Door } from "../gameObjects/door";

export function CreateRoom1(): void {
  // Create a door with a look and feel specific to this room
  const door = new Door(
    new GLTFShape("models/room1/Puzzle01_Door.glb"),
    { position: new Vector3(21.18, 10.8, 24.5) },
    new AudioClip("sounds/door_squeak.mp3")
  );

  door.addComponent(
    new OnClick((): void => {
      // In this room, the door opens when clicked
      door.openDoor();
    })
  );
}
