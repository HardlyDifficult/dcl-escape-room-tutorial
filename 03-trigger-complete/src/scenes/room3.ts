import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Door } from "../gameObjects/door";
import { MovableEntity } from "../gameObjects/movableEntity";
import { Button } from "../gameObjects/button";

export function CreateRoom3(): void {
  // Add the door for this room
  const door = new Door(
    new GLTFShape("models/room3/Puzzle03_Door.glb"),
    { position: new Vector3(24.1166, 7.17, 15.78) },
    new AudioClip("sounds/room3/whip.mp3")
  );
  // This door starts open
  door.isOpen = true;

  // Create an invisible trigger to detect when the player enters the room
  const trigger = new Entity();
  engine.addEntity(trigger);
  trigger.addComponent(
    new Transform({ position: new Vector3(25.5, 7.17, 19.5) })
  );
  trigger.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(4.2, 3, 8), Vector3.Zero()),
      0,
      0,
      null,
      null,
      (): void => {
        // onCameraEnter
        // Slam the door shut before they can run through
        door.closeDoor();
      },
      (): void => {
        // onCameraExit
        // And tease them by opening the door again if they start to walk away (but quietly)
        door.openDoor(false);
      }
    )
  );

  // Add a big red button
  const button = new Button(new GLTFShape("models/room3/Round_Button.glb"), {
    position: new Vector3(22.4456, 5.92706, 24.18)
  });

  // Open the door when the button is pressed
  button.addComponent(
    new OnClick((): void => {
      button.press();
      door.openDoor(false);
      // And disable the trigger so that we don't slam the door again
      trigger.getComponent(utils.TriggerComponent).enabled = false;
    })
  );

  // Add a few movable plants in the room, one of which is covering the button
  new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant1.glb"),
    { position: new Vector3(23.2489, 5.5071, 23.813) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, -0.5)
  );
  new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant2.glb"),
    { position: new Vector3(26.9356, 5.52006, 23.4817) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, -0.5)
  );
  new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant3.glb"),
    { position: new Vector3(23.4513, 5.50571, 16.8218) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, 0.5)
  );
  new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant4.glb"),
    { position: new Vector3(26.9878, 5.51511, 16.8279) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, 0.5)
  );
}
