# 03-plants

Start with the [03-trigger-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/03-trigger-playground) folder, it has the gameObjects we created last time, a placeholder `room3.ts` and the model & sound files for this room.

Resources:
- [03-trigger-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/03-trigger-complete)
- [03-trigger-refactored](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/03-trigger-refactored)

## Moving Objects

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/lMS0me-9Ra0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Start with adding a door and button with an OnClick to close the door:

```typescript
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Door } from "../gameObjects/door";
import { Button } from "../gameObjects/button";

export function CreateRoom3(): void {
  const door = new Door(
  	new GLTFShape("models/room3/Puzzle03_Door.glb"),
  	{ position: new Vector3(24.1166, 7.17, 15.78) },
  	new AudioClip("sounds/room3/whip.mp3")
  );
  door.isOpen = true;
  
  const button = new Button(
  	new GLTFShape("models/generic/Round_Button.glb"),
  	{ position: new Vector3(22.4456, 5.92706, 24.17) },
  );
  
  button.addComponent(new OnClick((): void => {
  	button.press();
  	door.openDoor(false);
  }));
}
```

Create `movableEntity.ts` in the `gameObjects` folder and add the following code:

```typescript
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class MovableEntity extends Entity{
  constructor(
  	model: GLTFShape,
  	transform: TranformConstructorArgs,
  	sound: AudioClip,
  	deltaPosition: Vector3
  ) {
  	super();
  	engine.addEntity(this);
  
  	this.addComponent(model);
  	this.addComponent(new Transform(transform));
  	this.addComponent(new AudioSource(sound));
  
  	const startPos = transform.position;
  	const endPos = transform.position.add(deltaPosition);
  
  	this.addComponent(
  	  new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
  	  	if(value === utils.ToggleState.On) {
  	  	  this.addComponentOrReplace(
  	  	  	new utils.MoveTransformComponent(
  	  	  		this.getComponent(Transform).position,
  	  	  		endPos,
  	  	  		0.5
  	  	  	)
  	  	  )
  	  	} else {
  	  	  this.addComponentOrReplace(
  	  	  	new utils.MoveTransformComponent(
  	  	  		this.getComponent(Transform).position,
  	  	  		startPos,
  	  	  		0.5
  	  	  	)
  	  	  )
  	  	}

		this.getComponent(AudioSource).playOnce();
  	  })
  	);
  }
}
```

Now in `room3.ts` add 4 MovableEntity objects with OnClick events:

```typescript
  // Add a few movable plants in the room, one of which is covering the button
  const fern1 = new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant1.glb"),
    { position: new Vector3(23.2489, 5.5071, 23.813) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, -0.5)
  );
  // When clicked, toggle position
  fern1.addComponent(
    new OnClick((): void => {
      fern1.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // And add a few decoy plants
  const fern2 = new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant2.glb"),
    { position: new Vector3(26.9356, 5.52006, 23.4817) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, -0.5)
  );
  fern2.addComponent(
    new OnClick((): void => {
      fern2.getComponent(utils.ToggleComponent).toggle();
    })
  );
  const fern3 = new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant3.glb"),
    { position: new Vector3(23.4513, 5.50571, 16.8218) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, 0.5)
  );
  fern3.addComponent(
    new OnClick((): void => {
      fern3.getComponent(utils.ToggleComponent).toggle();
    })
  );
  const fern4 = new MovableEntity(
    new GLTFShape("models/room3/Puzzle03_Plant4.glb"),
    { position: new Vector3(26.9878, 5.51511, 16.8279) },
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, 0.5)
  );
  fern4.addComponent(
    new OnClick((): void => {
      fern4.getComponent(utils.ToggleComponent).toggle();
    })
  );
```

## Player Triggers

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/6QGDYZdCxoI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

In `room3.ts` under the door code, add a trigger to open the door:

```typescript
const trigger = new Entity();
engine.addEntity(trigger);
trigger.addComponent(new Transform({
  position: new Vector3(25.5, 7.17, 19.5)
}));

trigger.addComponent(new utils.TriggerComponent(
  new utils.TriggerBoxShape(new Vector3(4.2, 3, 8), Vector3.Zero()),
  0,
  0,
  null,
  null,
  (): void => {
	door.closeDoor();
  },
  (): void => {
  	door.openDoor(false);
  }
));
```

Update the button OnClick event to disable the trigger when pressed:

```typescript
  button.addComponent(new OnClick((): void => {
  	button.press();
  	door.openDoor(false);

	trigger.getComponent(utils.TriggerComponent).enabled = false;
  }));
```

## Refactor

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/GrVAkoQ2ZwI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Create `index.ts` inside the `gameObjects` folder and add the following code:

```typescript
import { BaseScene } from "./baseScene";
import { Button } from "./button";
import { Door } from "./door";
import { MovableEntity } from "./movableEntity";
import { Timer } from "./timer";

export { BaseScene, Button, Door, MovableEntity, Timer };
```

In `room1.ts` change the import line to import from `index.ts`:

```typescript
import { Door } from "../gameObjects/index"
```

In `room2.ts` change the import line to import all gameObjects from `index.ts`:

```typescript
import { Button, Door, Timer } from "../gameObjects/index";
```

Alternatively you can change `index.ts` to export by default:

Index.ts:
```typescript
export default { BaseScene, Button, Door, MovableEntity, Timer };
```

Room3.ts:
```typescript
import gameObjects from "../gameObjects/index";
...
const door = new gameObjects.Door(
	new GLTFShape("models/room3/Puzzle03_Door.glb"),
...
```

