// The Timer and TimerSystem are DCL provided components used by this room
import { Timer, TimerSystem } from "../modules/timerSystem";

// Function to convert the time left into a string like "00:05"
function formatTimeString(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return (
    mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
    ":" +
    secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
  );
};

export function CreateRoom2(): void {
  /**
   * Door
   */

  // Add and position the door to open
  const door = new Entity();
  engine.addEntity(door);
  door.addComponent(new GLTFShape("models/generic/door.glb"));
  door.addComponent(
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Add the supported animations
  door.addComponent(new Animator());
  door.getComponent(Animator).addClip(new AnimationState("Open", { looping: false }));
  door.getComponent(Animator).addClip(new AnimationState("Close", { looping: false }));

  // And a sound effect to play when opening
  door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  /**
   * Countdown timer
   */

  // A timer which will run for 5 seconds
  const countDownTimer = new Timer(5);

  // Add and position the countdown display
  const countDownTimeText = new Entity();
  engine.addEntity(countDownTimeText);
  countDownTimeText.addComponent(
    new Transform({
      position: new Vector3(7.7, 3.5, 12.5),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Instead of a model, we'll add a TextShape to display the countdown
  countDownTimeText.addComponent(new TextShape(
    formatTimeString(countDownTimer.getTimeLeft())
  ));
  countDownTimeText.getComponent(TextShape).color = Color3.Red();

  // As the timer counts down
  countDownTimer.setOnTimerUpdate((): void => {
    // Update the text displayed
    countDownTimeText.getComponent(TextShape).value = formatTimeString(countDownTimer.getTimeLeft());
  });

  // When the timer ends
  countDownTimer.setOnTimerEnds((): void => {
    // Close the door
    door.getComponent(Animator).getClip("Open").stop();
    door.getComponent(Animator).getClip("Close").play();
    door.getComponent(AudioSource).playOnce();

    // Reset the timer
    countDownTimer.reset();
    countDownTimeText.getComponent(TextShape).value = formatTimeString(countDownTimer.getTimeLeft());
  });

  /**
   * Button
   */

  // Add the Button the we'll use to open the Door
  const button = new Entity();
  engine.addEntity(button);
  button.addComponent(new GLTFShape("models/generic/redbutton.gltf"));
  button.addComponent(
    new Transform({
      position: new Vector3(1.91, 1.1, 12.12),
      scale: new Vector3(0.3, 0.3, 0.3)
    })
  );

  // And a sound effect for when the button is pressed
  button.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
      // Start the timer if it is not already running
      if (!countDownTimer.isRunning()) {
        TimerSystem.instance.runTimer(countDownTimer);

        // Play a sound effect for the button
        button.getComponent(AudioSource).playOnce();

        // And open the door
        door.getComponent(Animator).getClip("Close").stop();
        door.getComponent(Animator).getClip("Open").play();
        door.getComponent(AudioSource).playOnce();
      }
    })
  );
}
