import { Timer, TimerSystem } from "../modules/timerSystem";

export function CreateRoom2(): void {
  // Creating Door Entity
  let door = new Entity();
  engine.addEntity(door);

  door.addComponent(new GLTFShape("models/generic/door.glb"));
  door.addComponent(
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Adding Door Animations
  let doorAnimator = new Animator();
  doorAnimator.addClip(new AnimationState("Open", { looping: false }));
  doorAnimator.addClip(new AnimationState("Close", { looping: false }));

  // Adding Animator and Sound Clip to Door
  door.addComponent(doorAnimator);
  door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  // Creating CountDown Timer
  let countDownTimer = new Timer(5);

  // Function to Convert Seconds left in Timer to a Formatted string
  let formatTimeString = (seconds: number): string => {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  };

  // Creating the Button the we'll use to Open the Door
  let button = new Entity();
  engine.addEntity(button);

  button.addComponent(new GLTFShape("models/generic/redbutton.gltf"));
  button.addComponent(
    new Transform({
      position: new Vector3(1.91, 1.1, 12.12),
      scale: new Vector3(0.3, 0.3, 0.3)
    })
  );

  // Adding Audio Source to Button
  button.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

  // Creating Countdown Display
  let countDown = new Entity();
  engine.addEntity(countDown);

  countDown.addComponent(
    new Transform({
      position: new Vector3(7.7, 3.5, 12.5),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Creating Text Shape for CountDown
  let countDownTextShape = new TextShape(
    formatTimeString(countDownTimer.getTimeLeft())
  );
  countDownTextShape.color = Color3.Red();
  countDown.addComponent(countDownTextShape);

  // Set to Listen for Countdown Timer's Update
  countDownTimer.setOnTimerUpdate((): void => {
    countDownTextShape.value = formatTimeString(countDownTimer.getTimeLeft());
  });

  // Set to Listen for Countdown Timer's End
  countDownTimer.setOnTimerEnds((): void => {
    // Resetting Timer
    countDownTimer.reset();
    countDownTextShape.value = formatTimeString(countDownTimer.getTimeLeft());

    // Closing Door
    doorAnimator.getClip("Open").stop();
    doorAnimator.getClip("Close").play();
    door.getComponent(AudioSource).playOnce();
  });

  // Set to Listen for OnClick Event for Button
  button.addComponent(
    new OnClick(() => {
      if (!countDownTimer.isRunning()) {
        // Resetting Timer
        countDownTimer.reset();
        TimerSystem.instance.runTimer(countDownTimer);

        // Opening Door
        doorAnimator.getClip("Close").stop();
        doorAnimator.getClip("Open").play();
        door.getComponent(AudioSource).playOnce();

        button.getComponent(AudioSource).playOnce();
      }
    })
  );
}
