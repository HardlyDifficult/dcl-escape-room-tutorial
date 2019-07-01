# 01: Room

Start with the default scene from 00.  Plus model, sound.  Maybe use playground

Add a door

After `engine.addEntity(scene)`...

```
//create door entity
let door = new Entity();

//add gltf shape
door.addComponent(new GLTFShape("models/generic/door.glb"));

//add transform and set it in position
door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));

//add door entity to engine
engine.addEntity(door);
```

Open the door

After `door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));`...

```
//variable to store if door is open
let isDoorOpen = false;

//create animator and add animation clips
let doorAnimator = new Animator();
doorAnimator.addClip(new AnimationState("Open", { looping: false }));
door.addComponent(doorAnimator);

//listen to onclick event to toggle door state
door.addComponent(
  new OnClick((): void => {
    if (!isDoorOpen) {
      isDoorOpen = true;
      doorAnimator.getClip("Open").play();
    }
  })
);

```

ends with ...`//add door entity to engine`


Play a sound effect

Add the an audio component and then play on click
```
//create audio source component, set audio clip and add it to door entity
door.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

//listen to onclick event to toggle door state
door.addComponent(
  new OnClick((): void => {
    if (!isDoorOpen) {
      isDoorOpen = true;
      doorAnimator.getClip("Open").play(); // <- insert this line
      door.getComponent(AudioSource).playOnce();
    }
  })
);
```

TODO then file separation
gameObjects: baseScene, door
Rooms: room1
