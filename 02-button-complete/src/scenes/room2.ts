import { Timer, TimerSystem } from "../modules/timerSystem";

export function CreateRoom2(): void {
  /**
   * TODO replace this with the Door gameObject like we did in room1
   * Need to add the "Close" animation state plus a function to closeDoor
   * Then below replace the play door clip/sound calls near the bottom with `openDoor` / `closeDoor`
   *
   * After we can make gameObjects for the other parts here.
   */

  //create door entity
  let door = new Entity();

  //add gltf shape
  door.addComponent(new GLTFShape("models/generic/door.glb"));

  //add transform and set positoin
  door.addComponent(
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  //creat animator and add animation clips
  let doorAnimator = new Animator();
  doorAnimator.addClip(new AnimationState("Open", { looping: false }));
  doorAnimator.addClip(new AnimationState("Close", { looping: false }));
  door.addComponent(doorAnimator);

  //create audio source component, set audio clip and add it to door entity
  let doorAudioSource = new AudioSource(
    new AudioClip("sounds/door_squeak.mp3")
  );
  door.addComponent(doorAudioSource);

  engine.addEntity(door);

  //create a timer that will keep the door open for X amount of seconds
  let countdownTimer = new Timer(5);

  //function to convert seconds left in timer to a formatted string
  let formatTimeString = (seconds: number) => {
    let mins = Math.floor(countdownTimer.getTimeLeft() / 60);
    let secs = Math.floor(countdownTimer.getTimeLeft() % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  };

  //create the button that we'll use to open the door
  let button = new Entity();

  //add shape component to button
  button.addComponent(new GLTFShape("models/generic/redbutton.gltf"));

  //add transform and set position
  button.addComponent(
    new Transform({
      position: new Vector3(1.91, 1.1, 12.12),
      scale: new Vector3(0.3, 0.3, 0.3)
    })
  );

  //add audio source to button
  button.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

  //create countdown displayer
  let countdown = new Entity();

  //add transform and set position
  countdown.addComponent(
    new Transform({
      position: new Vector3(7.7, 3.5, 12.5),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  //create text shape for countdown
  let countdownTextShape = new TextShape(
    formatTimeString(countdownTimer.getTimeLeft())
  );
  countdownTextShape.color = Color3.Red();
  countdown.addComponent(countdownTextShape);

  //set to listen for countdown timer's update
  countdownTimer.setOnTimerUpdate(dt => {
    countdownTextShape.value = formatTimeString(countdownTimer.getTimeLeft());
  });

  //listen for when we reach to the end of the countdown
  countdownTimer.setOnTimerEnds(() => {
    //reset countdown
    countdownTimer.reset();
    //stop previous animation as a workaround to a bug with animations
    doorAnimator.getClip("Open").stop();
    //play Close animation
    doorAnimator.getClip("Close").play();
    //play door sound
    doorAudioSource.playOnce();
    //reset countdown text value
    countdownTextShape.value = formatTimeString(countdownTimer.getTimeLeft());
  });

  //listen for click event to toggle door state
  button.addComponent(
    new OnClick(event => {
      //check if timer is running
      if (!countdownTimer.isRunning()) {
        //stop previous animation as a workaround to a bug with animations
        doorAnimator.getClip("Close").stop();
        //play Open animation
        doorAnimator.getClip("Open").play();
        //play door sound
        doorAudioSource.playOnce();
        //play button sound
        button.getComponent(AudioSource).playOnce();
        //reset countdown from previous state
        countdownTimer.reset();
        //make the timer run
        TimerSystem.instance.runTimer(countdownTimer);
      }
    })
  );
  //add entities to the engine
  engine.addEntity(button);
  engine.addEntity(countdown);
}
