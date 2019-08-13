import utils from "../../node_modules/decentraland-ecs-utils/index";
// When you use multiple objects they can appear in one line
import { Button, Door, Timer } from "../gameObjects/index";

const openDoorTime = 5;

export function CreateRoom2(): void {
  const door = new Door(
    new GLTFShape("models/room2/Puzzle02_Door.glb"),
    { position: new Vector3(24.1, 5.51634, 24.9) },
    new AudioClip("sounds/door_squeak.mp3")
  );

  const countdownClock = new Timer({
    position: new Vector3(25.1272, 9.51119, 25.2116),
    rotation: Quaternion.Euler(20, 180, 0)
  });
  countdownClock.updateTimeString(openDoorTime);

  const button = new Button(new GLTFShape("models/room2/Square_Button.glb"), {
    position: new Vector3(26.3714, 6.89, 26.8936)
  });

  button.addComponent(
    new OnClick((): void => {
      if (!countdownClock.hasComponent(utils.Interval)) {
        button.press();
        door.openDoor();

        let timeRemaining = openDoorTime;
        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            timeRemaining--;

            if (timeRemaining > 0) {
              countdownClock.updateTimeString(timeRemaining);
            } else {
              countdownClock.removeComponent(utils.Interval);

              door.closeDoor();

              countdownClock.updateTimeString(openDoorTime);
            }
          })
        );
      }
    })
  );
}
