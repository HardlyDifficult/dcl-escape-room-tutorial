const baseScene = new Entity();
engine.addEntity(baseScene);
baseScene.addComponent(new GLTFShape("models/scene.glb"));

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

// Add an AudioSource to play a squeak as the door opens
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

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
      // And the sound effect
      door.getComponent(AudioSource).playOnce();
    }
  })
);
