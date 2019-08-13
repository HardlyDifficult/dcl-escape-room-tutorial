import utils from "../../node_modules/decentraland-ecs-utils/index";
// Various game objects used in this room
import { Door } from "../gameObjects/door";
import { Button } from "../gameObjects/button";
import { Timer } from "../gameObjects/timer";

const openDoorTime = 5;

export function CreateRoom2(): void {
  // Create a door with a look and feel specific to this room
  const door = new Door(
    new GLTFShape("models/room2/Puzzle02_Door.glb"),
    { position: new Vector3(24.1, 5.51634, 24.9) },
    new AudioClip("sounds/door_squeak.mp3")
  );

  // Create the timer on the wall
  const countdownClock = new Timer(
    { position: new Vector3(25.1272, 9.51119, 25.2116),
      rotation: Quaternion.Euler(20, 180, 0) }
  );
  // and set the default value
  countdownClock.updateTimeString(openDoorTime);

  // Create a button
  const button = new Button(new GLTFShape("models/room2/Square_Button.glb"), {
    position: new Vector3(26.3714, 6.89, 26.8936)
  });

  button.addComponent(
    new OnClick((): void => {
      if (!countdownClock.hasComponent(utils.Interval)) {
        // Play the press effect
        button.press();
        // Open the door
        door.openDoor();

        let timeRemaining = openDoorTime;
        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            timeRemaining--;

            if (timeRemaining > 0) {
              // Use the updateTime helper
              countdownClock.updateTimeString(timeRemaining);
            } else {
              countdownClock.removeComponent(utils.Interval);

              // Close the door
              door.closeDoor();

              // Then reset the text
              countdownClock.updateTimeString(openDoorTime);
            }
          })
        );
      }
    })
  );
}
