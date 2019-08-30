# 02: Button

`WIP: Please come back soon`

Start with the 02-button-playground folder, it has the default scene from 00-setup, a placeholder `room2.ts` and the model & sound files for this room.

Resources:
 - [02-button-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/02-button-complete): this room's implementation
 - [02-button-refactored](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/02-button-refactored): the complete game up until this point including some housekeeping

## Add

Add a door for this room

```typescript
export function CreateRoom2(): void {
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
}
```

The timer is going to countdown from 5.  We'll create a helper function to format a string to display that looks like "00:05".

```typescript
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
```

Add a `TextShape` on the clock to display the time remaining.

```typescript
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
```

Now add a button which is going to open the door and start the timer:

```typescript
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
```

The timer itself is going to use the `Interval` component provided by DCL. 

To install the package, run:

```shell
npm i decentraland-ecs-utils
```

Then we can import it with the following:

```typescript
// DCL provided components used by this room
import utils from "../../node_modules/decentraland-ecs-utils/index";
```

Now let's create a OnClick handler for the button which opens the door if the timer is not running:

```typescript
  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
      // Checking if timer is running
      if (!countdownClock.hasComponent(utils.Interval)) {
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
      }
    })
  );
}
```

Inside the OnClick handler, we'll add an `Interval` which counts down to 0:

```typescript
        // And add an interval to update the text every 1 second and slam the door again when time runs out
        let timeRemaining = openDoorTime;
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
```

## Refactor

Separate gameObjects into separate files.  This will simplify the scenes and encourage re-use across rooms, reducing the number of lines of code for this game and making maintenance easier as things mature. 