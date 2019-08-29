# 01: Door

Start with the [01-door-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/01-door-playground) folder, it has the default scene from 00-setup and the model & sound files for this room.

Resources:
 - [01-door-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/01-door-complete): this room's implementation
 - [01-door-refactored](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/01-door-refactored): this room after introducing file separation

## Add a door

Inside `game.ts` add the following after the base scene code:

```typescript
// Add an entity for the door
const door = new Entity();
engine.addEntity(door);

// Give it a model and move it into place
door.addComponent(new GLTFShape("models/room1/Puzzle01_Door.glb"));
door.addComponent(new Transform({ position: new Vector3(21.18, 10.8, 24.5) }));
```

This adds a door and positions it in the doorway for the first room.

## Animate opening the door

Add an Animator and play `Door_Open` when the door is clicked:

```typescript
// Add an Animator to play clips inside the model file, created by the artist
door.addComponent(new Animator());
// This model has an "Open" animation that when played should happen once and then stop moving
door
  .getComponent(Animator)
  .addClip(new AnimationState("Door_Open", { looping: false }));

// When the player clicks on the door, open it!
let isDoorOpen = false;
door.addComponent(
  new OnClick((): void => {
    // Play the animation
    door
      .getComponent(Animator)
      .getClip("Door_Open")
      .play();
  })
);
```

## Play a sound effect on open

And an audio source to play a sound effect when opened:

```typescript
// Add an AudioSource to play a squeak as the door opens
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));
```

Update the OnClick event handler to play the sound, once, when the door opens:

```typescript
    // Track if the door has already been opened so we don't play the animation twice
    if (!isDoorOpen) {
      isDoorOpen = true;
      
      door
        .getComponent(Animator)
        .getClip("Door_Open")
        .play();

      // And the sound effect
      door.getComponent(AudioSource).playOnce();
    }

```

Audio is 3d, meaning that where the sound originates is relevant in terms of how loud it is for the user and if it's coming from the left or the right.

## Refactor

Separate the game into seperate scene files.  This file separation makes it easy to focus on just one room at a time.

Create `scenes/room1.ts` with:

```typescript
// Export as a function for game.ts to call in order to construct this room
export function CreateRoom1(): void {
  ...
}
```

And cut the room 1 code from `game.ts` and paste it in that function.

Update `game.ts` to include the new file and call `CreateRoom1`:

```typescript
import { CreateRoom1 } from "./scenes/room1";

...

// Room 1 was moved to another file
CreateRoom1();
```