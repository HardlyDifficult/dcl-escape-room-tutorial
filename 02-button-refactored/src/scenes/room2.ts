// DCL provided components used by this room
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Door } from "../gameObjects/door";
import { Button } from "../gameObjects/button";
import { Timer } from "../gameObjects/timer";

export function CreateRoom2(): void {
  /**
   * Door
   */

  const door = new Door(
    new GLTFShape("models/room2/Puzzle02_Door.glb"),
    new Transform({
      position: new Vector3(24.1, 5.51634, 24.9)
    }),
    new AudioClip("sounds/door_squeak.mp3")
  );

  /**
   * Countdown timer
   */

  // Add a model to display the countdown timer on the wall
  const countdownClock = new Timer(
    new Transform({
      position: new Vector3(25.1272, 9.51119, 25.1116)
    })
  );

  /**
   * Button
   */

  // Add the Button the we'll use to open the Door
  const button = new Button(
    new GLTFShape("models/room2/Square_Button.glb"),
    new Transform({
      position: new Vector3(26.3714, 6.89, 26.8936)
    })
  );

  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
      if (!countdownClock.hasComponent(utils.Interval)) {
        let timeRemaining = countdownClock.openDoorTime;

        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            timeRemaining--;
            countdownClock.updateTimeString(timeRemaining);

            if (timeRemaining <= 0) {
              countdownClock.removeComponent(utils.Interval);
              door.closeDoor();
            }
          })
        );

        door.openDoor();
      }
    })
  );
}
