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

  // The text for the timer is a separate entity
  const countdownText = new Entity();
  engine.addEntity(countdownText);

  countdownText.addComponent(
    new Transform({
      position: new Vector3(25.1272, 9.51119, 25.2116),
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
      if (!countdownText.hasComponent(utils.Interval)) {
        // Animate the button press
        button
          .getComponent(Animator)
          .getClip("Button_Action")
          .stop(); // bug workaround
        button
          .getComponent(Animator)
          .getClip("Button_Action")
          .play();

        // And play the button sound effect
        button.getComponent(AudioSource).playOnce();

        // Open the door
        door
          .getComponent(Animator)
          .getClip("Door_Close")
          .stop(); // bug workaround
        door
          .getComponent(Animator)
          .getClip("Door_Open")
          .play();
        // And play the sound effect
        door.getComponent(AudioSource).playOnce();

        // And add an interval to update the text every 1 second and slam the door again when time runs out
        let timeRemaining = openDoorTime;
        countdownText.addComponent(
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
              countdownText.removeComponent(utils.Interval);

              // Close the door
              door
                .getComponent(Animator)
                .getClip("Door_Open")
                .stop(); // bug workaround
              door
                .getComponent(Animator)
                .getClip("Door_Close")
                .play();
              door.getComponent(AudioSource).playOnce();

              // Then reset the text
              countdownText.getComponent(TextShape).value = formatTimeString(
                openDoorTime
              );
            }
          })
        );
      }
    })
  );
}
