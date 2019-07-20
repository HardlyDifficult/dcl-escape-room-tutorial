# 01: Room

Start with the default scene from 00.  Plus model, sound.  Maybe use playground

Add a door

After `engine.addEntity(baseScene)`...

```
//create door entity
let door = new Entity();
//add door entity to engine
engine.addEntity(door);

//add gltf shape
door.addComponent(new GLTFShape("models/generic/door.glb"));

//add transform and set it in position
door.addComponent(new Transform({ position: new Vector3(6.58, 0, 7.85) }));
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

## Refactor

Separate the game into seperate scene files.

## Challenge to the reader

The model also includes a `close` animation.  Add this to the Door GameObject and update the click behavior to toggle the door open/closed on click (instead of just open and then stay open).