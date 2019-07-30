// The Timer and TimerSystem are DCL provided components used by this room
import utils from "decentraland-ecs-utils";

const openDoorTime = 5; // Seconds

// Function to convert the time left into a string like "00:05"
function formatTimeString(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return (
    mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
    ":" +
    secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
  );
}

export function CreateRoom2(): void {
  /**
   * Door
   */

  // Add and position the door to open
  const door = new Entity();
  engine.addEntity(door);
  door.addComponent(new GLTFShape("models/room2/Puzzle02_Door.glb"));
  door.addComponent(
    new Transform(
      {
        position:new Vector3(24.1,5.51634,24.9)
      })
  );

  // Add the supported animations
  door.addComponent(new Animator());
  door
    .getComponent(Animator)
    .addClip(new AnimationState("Door_Open", { looping: false }));
  door
    .getComponent(Animator)
    .addClip(new AnimationState("Door_Close", { looping: false }));

  // And a sound effect to play when opening
  door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  /**
   * Countdown timer
   */
  // Create entity that will contain the countdown
  let countDownDisplayer = new Entity();
  engine.addEntity(countDownDisplayer);

  // Adding Mesh to the Displayer
  countDownDisplayer.addComponent(new GLTFShape("models/room1/Puzzle02_ButtomScreen.glb"));

  // Set position to the displayer
  countDownDisplayer.addComponent(
    new Transform({
    position: new Vector3(25.1272,9.51119,25.1116)
      })
    );

    // Create countdown displayer
    let countdown = new Entity();

    // Set countdown text as child of displayer
    countdown.setParent(countDownDisplayer);

    // Add transform and set position
    countdown.addComponent(
      new Transform({
        position: new Vector3(0,0,0.1), rotation: Quaternion.Euler(20,180,0) 
      })
    );

    //create text shape for countdown
    let countdownTextShape = new TextShape(formatTimeString(openDoorTime));
    countdownTextShape.color = Color3.Red();
    countdownTextShape.fontSize = 5;
    countdown.addComponent(countdownTextShape);

  /**
   * Button
   */

  // Add the Button the we'll use to open the Door
  const button = new Entity();
  engine.addEntity(button);
  button.addComponent(new GLTFShape("models/room2/Square_Button.glb"));
  button.addComponent(
    new Transform({
      position: new Vector3(26.3714,6.89,26.8936)
    })
  );
    // Create animator for button
    let buttonAnimator = new Animator()

    // Add clip to animator
    buttonAnimator.addClip(new AnimationState("Button_Action", {looping:false}))

  // And a sound effect for when the button is pressed
  button.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

  // Add animator to button
  button.addComponent(buttonAnimator);

  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
      // Checking if timer is running
      if (!countDownDisplayer.hasComponent(utils.Interval)) {
        let countdown = openDoorTime;

        // Create 1 second interval
        countDownDisplayer.addComponent(new utils.Interval(1000,(): void =>{
        countdown --;

        if (countdown > 0){
          countdownTextShape.value = formatTimeString(countdown);
        }
        else{
          // Reset countdown
          countDownDisplayer.removeComponent(utils.Interval);

          // Stop previous animation as a workaround to a bug with animations
          door.getComponent(Animator).getClip("Door_Open").stop();
          // Play Close animation
          door.getComponent(Animator).getClip("Door_Close").play();
          // Play door sound
          door.getComponent(AudioSource).playOnce(); 
          // Reset countdown text value
          countdownTextShape.value = formatTimeString(openDoorTime);
        }
        }));
      
        // Stop previous animation as a workaround to a bug with animations
        door.getComponent(Animator).getClip("Door_Close").stop();
        // Play Open animation
        door.getComponent(Animator).getClip("Door_Open").play();
        // Play door sound
        door.getComponent(AudioSource).playOnce();
        // Play button sound
        button.getComponent(AudioSource).playOnce();
        // Play button animation
        buttonAnimator.getClip("Button_Action").stop();
        buttonAnimator.getClip("Button_Action").play();
      }
    })
  );
}
