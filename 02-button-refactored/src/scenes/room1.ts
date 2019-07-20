// Import the Door GameObject
import { Door } from "../gameObjects/door";

export function CreateRoom1(): void {
  // Construct a new Door instead of an Entity followed by the usual components
  const door = new Door("models/generic/door.glb", {
    position: new Vector3(6.58, 0, 7.85)
  });

  // But we can still add components for game logic
  // In this case opening on-click is specific to this room's door
  door.addComponent(
    new OnClick((): void => {
      door.openDoor();
    })
  );
}
