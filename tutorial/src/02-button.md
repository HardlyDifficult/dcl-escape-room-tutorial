# 02: Button

`WIP: Please come back soon`

Start with the [02-button-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/02-button-playground) folder, it has the default scene & all the models and sound files for this room.

Resources:
 - [02-button-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/02-button-complete): this room's implementation
 - [02-button-refactored](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/02-button-refactored): the complete game up until this point including some housekeeping

## Adding a door with a button

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/OUfPVwVnQ8w" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Inside of `room2.ts` add the following code inside the CreateRoom2() function:

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
This will add a door similar to the code in [01-door-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/01-door-complete) now add the following code for the button:

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

To get the door to open when the button is pressed insert the following code:

```typescript
  // When the player clicks the button
  button.addComponent(
    new OnClick((): void => {
	  // Animate the button press
	  button
      .getComponent(Animator)
      .getClip("Button_Action")
      .play();

	  // And play the button sound effect
      button.getComponent(AudioSource).playOnce();

	  // Open the door
	  door
      .getComponent(Animator)
      .getClip("Door_Open")
      .play();

	  // And play the sound effect
      door.getComponent(AudioSource).playOnce();
	})
  );
```

## Adding a timer display

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/2k6pYbdROEw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Add a new entity and add a TextShape component:

```typescript
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
  countdownText.addComponent(new TextShape("00:05"));

  // And style the text a bit
  countdownText.getComponent(TextShape).color = Color3.Red();
  countdownText.getComponent(TextShape).fontSize = 5;
```

Make a function to format the time, this should be places outside of the CreateRoom2() function:

```typescript
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

Update the TextShape value to use the new function:

```typescript
  // Use a `TextShape` and set the default value
  countdownText.addComponent(new TextShape(formatTimeString(5)));
```

## Adding the timer

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/ixglVeJETvc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Add an Interval component inside of the button OnClick event:

```typescript
let timeRemaining = 5;
counddownText.addComponent(
  new utils.Interval(1000, (): void =>{
    // 1 second has past (passed?)
	timeRemaining--;

	if(timeRemaining > 0){
		countdownText.getComponent(TextShape).value = formatTimeString(timeRemaining);
	} else {
	  // Timer has reached 0! Remove the interval to prevent a negative time
	  countdownText.removeComponent(utils.Interval);

	  // Close the door
	  door
      .getComponent(Animator)
      .getClip("Door_Close")
      .play();

      door.getComponent(AudioSource).playOnce();

	  countdownText.getComponent(TextShape).value = formatTimeString(5);
	}
  })
);
```

Prevent multiple intervals being created by adding an if condition in the button OnClick event and fix the animation bug by stopping animations:

```typescript
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
      let timeRemaining = 5;
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
            countdownText.getComponent(TextShape).value = formatTimeString(5);
          }
        })
      );
    }
  })
);
```

## Refactor

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/_kksSC91DKE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Seperate the baseScene from `game.ts`, copy and paste them into a new file called `baseScene.ts` inside a folder called `gameObjects`:

```typescript
export class BaseScene extends Entity {

  constructor() {
    super();
    engine.addEntity(this);
    this.addComponent(new GLTFShape("models/scene.glb"));
  }
}
```

Update the `game.ts` to create the BaseScene:

```typescript
import { CreateRoom1 } from "./scenes/room1";
import { CreateRoom2 } from "./scenes/room2";

new BaseScene();

CreateRoom1();
CreateRoom2();
```

Out of `room2.ts` cut all of the door creation code into a new file `door.ts` inside the gameObjects folder and change the model, transform and sound to arguments:

```typescript
export class Door extends Entity {

  constructor(
    model: GLTFShape,
	transform: TranformConstructorArgs,
	sound: AudioClip
  ) {
    super();
	engine.addEntity(this);

	this.addComponent(model);
	this.addComponent(new Transform(transform));

	this.addComponent(new Animator());
	this
	  .getComponent(Animator)
	  .addClip(new AnimationState("Door_Open", { looping: false }));
	this
	  .getComponent(Animator)
	  .addClip(new AnimationState("Door_Close", { looping: false }));

	this.addComponent(new AudioSource(sound));
  }
}
```

Update `room1.ts` & `room2.ts` to use the new Door entity:

Room1:
```typescript
import { Door } from "../gameObjects/door";

export function CreateRoom1(): void {
  const door = new Door(
    new GLTFShape("models/room1/Puzzle01_Door.glb"),
	{
		position: new Vector3(21.18, 10.9, 24.5)
	},
	new AudioClip("sounds/door_squeak.mp3")
  );

  let isDoorOpen = false;
  ...
```

Room2:
```typescript
import { Door } from "../gameObjects/door";

export function CreateRoom2(): void {
  const door = new Door(
  	  new GLTFShape("models/room2/Puzzle02_Door.glb"),
	  {
	  	  position: new Vector3(24.1, 5.51634, 24.9)
	  },
	  new AudioClip("sounds.door_squeak.mp3")
  );

  const button = new Entity();
  ...
```

Update `door.ts` to have open, close and toggle logic:

```typescript
export class Door extends Entity {
  public isOpen: boolean;

  // Allow each room to specify a unique look and feel
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    sound: AudioClip
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Door_Open", { looping: false })
    );
    this.getComponent(Animator).addClip(
      new AnimationState("Door_Close", { looping: false })
    );

    this.addComponent(new AudioSource(sound));
  }

  public openDoor(playAudio = true): void {
    if (!this.isOpen) {
      this.isOpen = true;

      this.getComponent(Animator)
        .getClip("Door_Close")
        .stop(); // bug workaround
      this.getComponent(Animator)
        .getClip("Door_Open")
        .play();

      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }

  public closeDoor(playAudio = true): void {
    if (this.isOpen) {
      this.isOpen = false;

      this.getComponent(Animator)
        .getClip("Door_Open")
        .stop(); // bug workaround
      this.getComponent(Animator)
        .getClip("Door_Close")
        .play();

      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }

  public toggleDoor(playAudio = true): void {
    if (this.isOpen) {
      this.closeDoor(playAudio);
    } else {
      this.openDoor(playAudio);
    }
  }
}
```

Change `room1.ts` & `room2.ts` to use the new function:

Room1:
```typescript
  door.addComponent(
    new OnClick((): void => {
      // In this room, the door opens when clicked
      door.openDoor();
    })
  );
```

Room2:
```typescript
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
      door.openDoor();

      // And add an interval to update the text every 1 second and slam the door again when time runs out
      let timeRemaining = 5;
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
			door.closeDoor();

            // Then reset the text
            countdownText.getComponent(TextShape).value = formatTimeString(5);
          }
        })
      );
    }
  })
);
```

Create  `button.ts` inside the gameObject folder and update the logic similar to the door:

```typescript
export class Button extends Entity {
  // The shape and position may differ
  constructor(model: GLTFShape, 
  transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));

    this.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Button_Action", { looping: false })
    );
  }

  public press(): void {
    this.getComponent(Animator)
      .getClip("Button_Action")
      .stop(); // bug workaround
    this.getComponent(Animator)
      .getClip("Button_Action")
      .play();
    this.getComponent(AudioSource).playOnce();
  }
}
```

Create `timer.ts` inside the gameObject folder and update the logic:

```typescript
export class Timer extends Entity {
  // Store the text entity for use in the method below

  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));

    // The value to display will be controlled by the scene itself
    this.addComponent(new TextShape());
    this.getComponent(TextShape).color = Color3.Red();
    this.getComponent(TextShape).fontSize = 5;
  }

  private formatTimeString(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  }

  // This method can be called anytime to change the number of seconds on the clock
  public updateTimeString(seconds: number): void {
    this.getComponent(TextShape).value = this.formatTimeString(seconds);
  }
}
```

Replace `room2.ts` code to use the new Button and Timer entity:

```typescript
// Create the timer on the wall
  const countdownClock = new Timer({
    position: new Vector3(25.1272, 9.51119, 25.2116),
    rotation: Quaternion.Euler(20, 180, 0)
  });
  // and set the default value
  countdownClock.updateTimeString(5);

  // Create a button
  const button = new Button(new GLTFShape("models/room2/Square_Button.glb"), {
    position: new Vector3(26.3714, 6.89, 26.8936)
  });

  button.addComponent(
    new OnClick((): void => {
      if (!countdownClock.hasComponent(utils.Interval)) {
        // Play the press effect
        button.press();
        // Open the door
        door.openDoor();

        let timeRemaining = 5;
        countdownClock.addComponent(
          new utils.Interval(1000, (): void => {
            timeRemaining--;

            if (timeRemaining > 0) {
              // Use the updateTime helper
              countdownClock.updateTimeString(timeRemaining);
            } else {
              countdownClock.removeComponent(utils.Interval);

              // Close the door
              door.closeDoor();

              // Then reset the text
              countdownClock.updateTimeString(5);
            }
          })
        );
      }
    })
  );
```
