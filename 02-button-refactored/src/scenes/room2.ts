import { Timer, TimerSystem } from "../modules/timerSystem";

// Import the gameObjects for this room
import { CountdownTimeText } from "../gameObjects/countdownTimeText";
import { Door } from "../gameObjects/door";
import { Button } from "../gameObjects/button";

export function CreateRoom2(): void {
  // Swap out the door
  const door = new Door(
    "models/generic/door.glb",
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // We are leaving the timer itself here, but also moving this into the gameObject to
  // create a full `CountdownTimer` is an option as well.
  const countDownTimer = new Timer(5);

  // And the countdown time text
  const countDownTimeText = new CountdownTimeText({
    position: new Vector3(7.7, 3.5, 12.5),
    rotation: Quaternion.Euler(0, 90, 0)
  });
  // Update the text displayed with the current time left
  countDownTimeText.updateDisplay(countDownTimer.getTimeLeft());

  countDownTimer.setOnTimerUpdate((): void => {
    // Update display as the timer updates
    countDownTimeText.updateDisplay(countDownTimer.getTimeLeft());
  });

  countDownTimer.setOnTimerEnds((): void => {
    // Close the door
    door.closeDoor();

    countDownTimer.reset();
    // Update display again
    countDownTimeText.updateDisplay(countDownTimer.getTimeLeft());
  });

  // Swap out the button
  const button = new Button(
    new Transform({
      position: new Vector3(1.91, 1.1, 12.12),
      scale: new Vector3(0.3, 0.3, 0.3)
    })
  );

  // Leave the on-click behavour here so that the button could be used again in other ways
  button.addComponent(
    new OnClick((): void => {
      if (!countDownTimer.isRunning()) {
        countDownTimer.reset();
        TimerSystem.instance.runTimer(countDownTimer);

        // Open the door
        door.openDoor();
        // Press the button
        button.pressButton();
      }
    })
  );
}
