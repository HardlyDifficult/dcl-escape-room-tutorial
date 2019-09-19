# 08-arcade

Start with [08-arcade-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/08-arcade-playground)

Resources:
- [08-arcade-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/08-arcade-complete)

## Path Following

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/Pf6_JKYyylg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Start off by adding a new file in the `components` folder and call it `mouseFollowPathComponent.ts`:

```typescript
import utils from "../../node_modules/decentraland-ecs-utils/index";

@Component("mouseFollowPathComponent")
export class MouseFollowPathComponent {
  private startDelay: number;
  private idleTime: number;
  private path: Vector3[];
  private movingTime: number;

  private currentTime: number;
  private isInIdleTime: boolean;

  constructor(
    startDelay: number,
    idleTime: number,
    path: Vector3[],
    movingTime: number
  ) {
    this.startDelay = startDelay;
    this.idleTime = idleTime;
    this.path = path;
    this.movingTime = movingTime;

    this.currentTime = idleTime;
    this.isInIdleTime = true;
  }
}
```

Then create another new file in te same folder called `mouseFollowPathSystem.ts`:

```typescript
import { MouseFollowPathComponent } from "./mouseFollowPathComponent";

export class MouseFollowPathSystem implements ISystem {
  update(dt: number): void {
    const mouseGroup = engine.getComponentGroup(MouseFollowPathComponent);
    for (const mouseEntity of mouseGroup.entities) {
      mouseEntity
        .getComponent(MouseFollowPathComponent)
        .update(dt, mouseEntity);
    }
  }
}
```

Back in `mouseFollowPathComponent.ts` create a method called update that will move the mouse's position over time:

```typescript
update(dt: number, mouseEntiy: IEntity) {
  //check if waiting for start
  if (this.startDelay > 0) {
    this.startDelay -= dt;
  }
  //when mouse is idle
  else if (this.isInIdleTime) {
    //increase time in idle state
    this.currentTime += dt;
    //when idle time is reached
    if (this.currentTime >= this.idleTime) {
      //we are not in idle state any more
      this.isInIdleTime = false;

      //rotate mouse to look at it's next point in path
      mouseEntiy.getComponent(Transform).lookAt(this.path[1]);
      //add component to follow the path
      mouseEntiy.addComponentOrReplace(
        new utils.FollowPathComponent(
          this.path,
          this.movingTime,
          () => {
            //when path is finished we reset mouse variables
            this.isInIdleTime = true;
            this.currentTime = 0;
            //we set the mouse to go the other way arround next time
            this.path.reverse();
          },
          (currentPoint, nextPoint) => {
            //when we reach a new point in path we rotate the mouse to look at the next point
            mouseEntiy.getComponent(Transform).lookAt(nextPoint);
          }
        )
      );
    }
  }
}
```

Switch to `room8.ts` and add the `mouseFollowComponent` to the mice:

```typescript
// Adding Mouse Behaviour System
const mouseBehaviorSystem = new MouseFollowPathSystem();
engine.addSystem(mouseBehaviorSystem);

// Creating Mouse Follow Components
mouse1.addComponent(
  new MouseFollowPathComponent(
    7.5,
    7,
    [
      new Vector3(17.37, 1.69, 10.06),
      new Vector3(16.7, 1.7, 11.47),
      new Vector3(16.3, 2.24, 11.28)
    ],
    2
  )
);
mouse2.addComponent(
  new MouseFollowPathComponent(
    0,
    6,
    [
      new Vector3(17.49, 0.6, 11.85),
      new Vector3(16.7, 1.7, 11.47),
      new Vector3(16.36, 1.7, 12.17)
    ],
    5
  )
);
```

Finally update the arcade.onCompletion callback to remove the mouse components:

```typescript
// When the player wins the game
arcade.onCompletion = () => {
  // Reveal the hint
  ticket.emitTicket();

  // Removing Components to stop the mice
  mouse1.removeComponent(utils.FollowPathComponent);
  mouse2.removeComponent(utils.FollowPathComponent);
  engine.removeSystem(mouseBehaviorSystem);
};
```
