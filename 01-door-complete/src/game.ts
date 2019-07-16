// Creating Main Scene
let baseScene = new Entity();
// Adding Main Scene into Engine
engine.addEntity(baseScene);

// Setting Base Scene Model and Transform
baseScene.addComponent(new GLTFShape("models/scene.glb"));
baseScene.addComponent(
  new Transform({ rotation: Quaternion.Euler(0, 180, 0) })
);

// Variable to Store is the Door is Open
let isDoorOpen = false;

// Creating Door Object
let door = new Entity();
// Adding Door into Engine
engine.addEntity(door);

// Adding Door Model
door.addComponent(new GLTFShape("models/generic/door.glb"));

// Setting Position of the Door
door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));

// Creating Door Animation
let doorAnimation = new Animator();
doorAnimation.addClip(new AnimationState("Open", { looping: false }));

// Adding Animation to the Door
door.addComponent(doorAnimation);
// Adding Sound Component
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

// Adding Open Door Event
door.addComponent(
  new OnClick(event => {
    if (!isDoorOpen) {
      isDoorOpen = true;
      doorAnimation.getClip("Open").play();
      door.getComponent(AudioSource).playOnce();
    }
  })
);
