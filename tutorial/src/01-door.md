# 01: Room

Start with the 01-room-playground folder, it has the default scene from 00-setup and the model & sound files for this room.

Add a door

After `engine.addEntity(baseScene)`...

```typescript
// Add an entity for the door
const door = new Entity();
engine.addEntity(door);

// Give it a model and move it into place
door.addComponent(new GLTFShape("models/room1/Puzzle01_Door.glb"));
door.addComponent(new Transform({ position: new Vector3(21.18, 10.8, 24.5) }));

// Add an Animator to play clips inside the model file, created by the artist
door.addComponent(new Animator());
// This model has an "Open" animation that when played should happen once and then stop moving
door
  .getComponent(Animator)
  .addClip(new AnimationState("Door_Open", { looping: false }));
```

Add an OnClick handler to open the door:

```typescript
// When the player clicks on the door, open it!
let isDoorOpen = false;
door.addComponent(
  new OnClick((): void => {
    // Track if the door has already been opened so we don't play the animation twice
    if (!isDoorOpen) {
      isDoorOpen = true;

      // Play the animation
      door
        .getComponent(Animator)
        .getClip("Door_Open")
        .play();
    }
  })
);
```

And an audio source to play a sound effect when opened:

```typescript
// Add an AudioSource to play a squeak as the door opens
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));
```

Audio is 3d, meaning that where the sound originates is relevant in terms of how loud it is for the user and if it's coming from the left or the right.

In the OnClick handler, add:

```
      // And the sound effect
      door.getComponent(AudioSource).playOnce();
```

## Refactor

Separate the game into seperate scene files.  This file separation makes it easy to focus on just one room at a time.

## Challenge to the reader

The model also includes a `close` animation.  Add this to the Door GameObject and update the click behavior to toggle the door open/closed on click (instead of just open and then stay open).