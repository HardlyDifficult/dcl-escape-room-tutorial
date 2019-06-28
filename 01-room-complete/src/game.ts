/**
 * Base scene
 */

const scene = new Entity();
scene.addComponent(new GLTFShape("models/scene.glb"));
scene.addComponent(new Transform({ rotation: Quaternion.Euler(0, 180, 0) }));
engine.addEntity(scene);

/**
 * Room 1: Open a door
 */

//create door entity
let door = new Entity();

//add gltf shape
door.addComponent(new GLTFShape("models/generic/door.glb"));

//add transform and set it in position
door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));

//variable to store if door is open
let isDoorOpen = false;

//create animator and add animation clips
let doorAnimator = new Animator();
doorAnimator.addClip(new AnimationState("Open", { looping: false }));
door.addComponent(doorAnimator);

//create audio source component, set audio clip and add it to door entity
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

//listen to onclick event to toggle door state
door.addComponent(
  new OnClick((): void => {
    if (!isDoorOpen) {
      isDoorOpen = true;
      doorAnimator.getClip("Open").play();
      door.getComponent(AudioSource).playOnce();
    }
  })
);

//add door entity to engine
engine.addEntity(door);
