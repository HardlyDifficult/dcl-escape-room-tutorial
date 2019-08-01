// DCL provided components used by this room
import utils from "../../node_modules/decentraland-ecs-utils/index";

const openDoorTime = 5; // in seconds

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

  const door = new Entity();
  engine.addEntity(door);
  door.addComponent(new GLTFShape("models/room2/Puzzle02_Door.glb"));
  door.addComponent(
    new Transform({
      position: new Vector3(24.1, 5.51634, 24.9)
    })
  );

  door.addComponent(new Animator());
  door
    .getComponent(Animator)
    .addClip(new AnimationState("Door_Open", { looping: false }));
  // Adding an additional animation for closing the door
  door
    .getComponent(Animator)
    .addClip(new AnimationState("Door_Close", { looping: false }));

  door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  /**
   * Countdown timer
   */

  // Add a model to display the countdown timer on the wall
  const countdownClock = new Entity();
  engine.addEntity(countdownClock);
  countdownClock.addComponent(
    new GLTFShape("models/room1/Countdown_Clock.glb")
  );
  countdownClock.addComponent(
    new Transform({
      position: new Vector3(25.1272, 9.51119, 25.1116)
    })
  );

  // The text for the timer is a separate entity
  const countdownText = new Entity();

  // Set the clock as the parent, instead of adding it to the engine.
  // This positions the countdown text relative to the clock itself.
  countdownText.setParent(countdownClock);

  // Make a small adjustment to the text position and rotation to the text
  countdownText.addComponent(
    new Transform({
      position: new Vector3(0, 0, 0.1),
      rotation: Quaternion.Euler(20, 180, 0)
    })
  );

  // Use a `TextShape` and set the default value
  countdownText.addComponent(new TextShape(formatTimeString(openDoorTime)));

  // And style the text a bit
  countdownText.getComponent(TextShape).color = Color3.Red();
  countdownText.getComponent(TextShape).fontSize = 5;

  /**
   * Button
   */

  // Add the Button the we'll use to open the Door
  const button = new Entity();
  engine.addEntity(button);
  button.addComponent(new GLTFShape("models/room2/Square_Button.glb"));
  button.addComponent(
    new Transform({
      position: new Vector3(26.3714, 6.89, 26.8936)
    })
  );

  // Add the button animation
  button.addComponent(new Animator());
  button
    .getComponent(Animator)
    .addClip(new AnimationState("Button_Action", { looping: false }));

  // And a sound effect for when the button is pressed
  button.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
      // Checking if timer is running
      if (!countdownClock.hasComponent(utils.Interval)) {
        let timeRemaining = openDoorTime;

        // Add an interval to update the text every 1 second
        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            // 1 second has past
            timeRemaining--;

            if (timeRemaining > 0) {
              // Update the display with the new timeRemaining
              countdownText.getComponent(TextShape).value = formatTimeString(
                timeRemaining
              );
            } else {
              // Timer has reached 0! Remove the interval so the display does not go negative
              countdownClock.removeComponent(utils.Interval);

              // Stop previous animation as a workaround to a bug with animations
              door
                .getComponent(Animator)
                .getClip("Door_Open")
                .stop();

              // Close the door
              door
                .getComponent(Animator)
                .getClip("Door_Close")
                .play();

              // And play the sound effect
              door.getComponent(AudioSource).playOnce();

              // Then reset the text
              countdownText.getComponent(TextShape).value = formatTimeString(
                openDoorTime
              );
            }
          })
        );

        // Stop previous animation as a workaround to a bug with animations
        door
          .getComponent(Animator)
          .getClip("Door_Close")
          .stop();

        // Open the door
        door
          .getComponent(Animator)
          .getClip("Door_Open")
          .play();
        door.getComponent(AudioSource).playOnce();

        // Animate the button press
        // Stop previous animation as a workaround to a bug with animations
        button
          .getComponent(Animator)
          .getClip("Button_Action")
          .stop();
        button
          .getComponent(Animator)
          .getClip("Button_Action")
          .play();

        // And play the button sound effect
        button.getComponent(AudioSource).playOnce();
      }
    })
  );
}
