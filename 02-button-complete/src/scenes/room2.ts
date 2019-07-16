import { Timer, TimerSystem } from "../modules/timerSystem";
import { Door } from "../gameObjects/door";

export function CreateRoom2(): void {
  /**
   * [?]After we can make gameObjects for the other parts here.
   */

  //create door entity
  let door = new Door(
    new Transform({
      position: new Vector3(8, 0, 11.74),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  //create a timer that will keep the door open for X amount of seconds
  let countdownTimer = new Timer(5);

  //function to convert seconds left in timer to a formatted string
  let formatTimeString = (seconds: number): string => {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
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
  countdownTimer.setOnTimerUpdate((): void => {
    countdownTextShape.value = formatTimeString(countdownTimer.getTimeLeft());
  });

  //listen for when we reach to the end of the countdown
  countdownTimer.setOnTimerEnds((): void => {
    //reset countdown
    countdownTimer.reset();
    //stop previous animation as a workaround to a bug with animations
    //doorAnimator.getClip("OpenDoor").stop();
    //play Close animation
    //doorAnimator.getClip("CloseDoor").play();
    //play door sound
    //doorAudioSource.playOnce();
    //reset countdown text value
    door.closeDoor();
    countdownTextShape.value = formatTimeString(countdownTimer.getTimeLeft());
  });

  //listen for click event to toggle door state
  button.addComponent(
    new OnClick((): void => {
      //check if timer is running
      if (!countdownTimer.isRunning()) {
        //stop previous animation as a workaround to a bug with animations
        //doorAnimator.getClip("CloseDoor").stop();
        //play Open animation
        //doorAnimator.getClip("OpenDoor").play();
        //play door sound
        //doorAudioSource.playOnce();
        //play button sound
        //button.getComponent(AudioSource).playOnce();
        //reset countdown from previous state
        door.openDoor();
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
