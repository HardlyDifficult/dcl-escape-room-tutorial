# 04-bookshelf

Start with [04-bookshelf-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/04-bookshelf-playground)

Resources:
- [04-bookshelf-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/04-bookshelf-complete)
- [04-bookshelf-refactored](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/04-bookshelf-refactored)

## Spinning an Object

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/Z5NHJmiA0zs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Inside of `room4.ts` start by adding in the Movable Entities for the Scene:

```typescript
const bookshelf = new MovableEntity(
  new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
  new Transform({
    position: new Vector3(20.6557, 5.4996, 15.041)
  }),
  new AudioClip("sounds/move_object1.mp3"),
  new Vector3(1.5, 0, 0)
);

const movableBook = new MovableEntity(
  new GLTFShape("models/room4/Puzzle04_Book2.glb"),
  new Transform({
    position: new Vector3(20.41, 6.4118, 10.4922)
  }),
  new AudioClip("sounds/move_object1.mp3"),
  new Vector3(0, 0, -0.2)
);
movableBook.addComponent(
  new OnClick((): void => {
    movableBook.getComponent(utils.ToggleComponent).toggle();
  })
);

const wineGlass = new MovableEntity(
  new GLTFShape("models/room4/Puzzle04_WGlass.glb"),
  new Transform({
    position: new Vector3(25.7505, 6.95786, 10.5917)
  }),
  new AudioClip("sounds/move_object2.mp3"),
  new Vector3(0.2, 0, 0)
);
wineGlass.addComponent(
  new OnClick((): void => {
    wineGlass.getComponent(utils.ToggleComponent).toggle();
  })
);
```

Create a copy of `movableEntity.ts` and call it `rotatableEntity.ts` and adjust the code to instead rotate the object:

```typescript
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class RotatableEntity extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    audio: AudioClip,
    rotation: Quaternion
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));
    this.addComponent(new AudioSource(audio));

    // Save the positions to move between
    const startRot = transform.rotation;
    const endRot = rotation;

    // Add a Toggle component which defaults to Off
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        if (value == utils.ToggleState.On) {
          // Rotate to the endRot when toggled on
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              endRot,
              0.5
            )
          );
        } else {
          // Rotate to the startRot when toggled on
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              startRot,
              0.5
            )
          );
        }

        // Play the sound effect
        this.getComponent(AudioSource).playOnce();
      })
    );
  }
}
```

Now go back to `room4.ts` and add in additional objects:

```typescript
const telescope = new RotatableEntity(
  new GLTFShape("models/room4/Puzzle04_Telescope.glb"),
  new Transform({
    position: new Vector3(22.6554, 7.02615, 10.6208)
  }),
  new AudioClip("sounds/move_object1.mp3"),
  Quaternion.Euler(0, 127, 0)
);
telescope.addComponent(
  new OnClick((): void => {
    telescope.getComponent(utils.ToggleComponent).toggle();
  })
);

const globe = new RotatableEntity(
  new GLTFShape("models/room4/Puzzle04_Globe.glb"),
  new Transform({
    position: new Vector3(21.2191, 7.11234, 10.6817),
    rotation: Quaternion.Euler(0.146, 34.9, -33.8)
  }),
  new AudioClip("sounds/move_object1.mp3"),
  Quaternion.Euler(174, -26.43, -149.37)
);

globe.addComponent(
  new OnClick((): void => {
    globe.getComponent(utils.ToggleComponent).toggle();
  })
);

const rotatableBook = new RotatableEntity(
  new GLTFShape("models/room4/Puzzle04_Book1.glb"),
  new Transform({
    position: new Vector3(15.8321, 7.83095, 14.1252)
  }),
  new AudioClip("sounds/move_object1.mp3"),
  Quaternion.Euler(0, 0, -25)
);

rotatableBook.addComponent(
  new OnClick((): void => {
    rotatableBook.getComponent(utils.ToggleComponent).toggle();
  })
);
```

Now add a rotatableEntity that will open the bookshelf:

```typescript
const candleHolder = new RotatableEntity(
  new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),
  new Transform({
    position: new Vector3(17.5056, 7.61611, 15.3835)
  }),
  new AudioClip("sounds/move_object2.mp3"),
  Quaternion.Euler(0, 0, 30)
);

candleHolder.addComponent(
  new OnClick((): void => {
    candleHolder.getComponent(utils.ToggleComponent).toggle();
    bookshelf.getComponent(utils.ToggleComponent).toggle();
  })
);
```

Go into `movableEntity.ts` and add an additional argument to adjust the speed of the move animation and give it a default value:

```typescript
constructor(
  model: GLTFShape,
  transform: TranformConstructorArgs,
  sound: AudioClip,
  deltaPosition: Vector3,
  moveTime = 0.5
)
...
this.addComponent(
new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
  if (value == utils.ToggleState.On) {
    this.addComponentOrReplace(
      new utils.MoveTransformComponent(
        this.getComponent(Transform).position,
        endPos,
        moveTime
      )
    );
...
```

Finally update the bookshelf in `room4.ts` to move slower

```typescript
  const bookshelf = new MovableEntity(
    new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(1.5, 0, 0),
    // Set a longer move time for the bookshelf
    3
  );
```

## Refactor

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/V-bkjDcESls" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Inside the `src` folder create a new file called `resources.ts` and add all the audio clips and models as a default export:

```typescript
export default {
  sounds: {
    button: new AudioClip("sounds/button.mp3"),
    doorSqueak: new AudioClip("sounds/door_squeak.mp3"),
    moveObject1: new AudioClip("sounds/move_object1.mp3"),
    moveObject2: new AudioClip("sounds/move_object2.mp3"),
    whip: new AudioClip("sounds/room3/whip.mp3")
  },
  models: {
    book1: new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    book2: new GLTFShape("models/room4/Puzzle04_Book2.glb"),
    candleHolder: new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),
    door1: new GLTFShape("models/room1/Puzzle01_Door.glb"),
    door2: new GLTFShape("models/room2/Puzzle02_Door.glb"),
    door3: new GLTFShape("models/room3/Puzzle03_Door.glb"),
    door4: new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
    glass: new GLTFShape("models/room4/Puzzle04_WGlass.glb"),
    globe: new GLTFShape("models/room4/Puzzle04_Globe.glb"),
    plant1: new GLTFShape("models/room3/Puzzle03_Plant1.glb"),
    plant2: new GLTFShape("models/room3/Puzzle03_Plant2.glb"),
    plant3: new GLTFShape("models/room3/Puzzle03_Plant3.glb"),
    plant4: new GLTFShape("models/room3/Puzzle03_Plant4.glb"),
    roundButton: new GLTFShape("models/generic/Round_Button.glb"),
    scene: new GLTFShape("models/scene.glb"),
    squareButton: new GLTFShape("models/room2/Square_Button.glb"),
    telescope: new GLTFShape("models/room4/Puzzle04_Telescope.glb")
  }
};
```

Now inside of `room4.ts` import the resources file and change the models and audio to use the ones located in said resources:

```typescript
import resources from "../resources";

export function CreateRoom4(): void {
  const bookshelf = new MovableEntity(
    resources.models.door4,
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    resources.sounds.moveObject1,
    new Vector3(1.5, 0, 0),
    3
  );

  const movableBook = new MovableEntity(
    resources.models.book2,
    new Transform({
      position: new Vector3(20.41, 6.4118, 10.4922)
    }),
    resources.sounds.moveObject1,
    new Vector3(0, 0, -0.2)
  );
  movableBook.addComponent(
    new OnClick((): void => {
      movableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );
...
```
