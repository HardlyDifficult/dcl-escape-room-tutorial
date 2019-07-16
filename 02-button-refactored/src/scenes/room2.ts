import { TimerSystem } from "../modules/timerSystem";
import { DoorTimer } from "../gameObjects/doorTimer";
import { Door } from "../gameObjects/door";
import { Button } from "../gameObjects/button";

export function CreateRoom2(): void {
  // Creating Door Entity
  let door = new Door(
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Creating CountDown Timer
  let countDownTimer = new DoorTimer(
    5,
    new Transform({
      position: new Vector3(7.7, 3.5, 12.5),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Creating the Button the we'll use to Open the Door
  let button = new Button(
    new Transform({
      position: new Vector3(1.91, 1.1, 12.12),
      scale: new Vector3(0.3, 0.3, 0.3)
    })
  );

  // Set to Listen for Countdown Timer's Update
  countDownTimer.setOnTimerUpdate((): void => {
    countDownTimer.updateTimeDisplay();
  });

  // Set to Listen for Countdown Timer's End
  countDownTimer.setOnTimerEnds((): void => {
    // Resetting Timer
    countDownTimer.reset();
    countDownTimer.updateTimeDisplay();

    // Closing Door
    door.closeDoor();
  });

  // Set to Listen for OnClick Event for Button
  button.addComponent(
    new OnClick(() => {
      if (!countDownTimer.isRunning()) {
        // Resetting Timer
        countDownTimer.reset();
        TimerSystem.instance.runTimer(countDownTimer);

        // Opening Door
        door.openDoor();
        button.getComponent(AudioSource).playOnce();
      }
    })
  );
}
