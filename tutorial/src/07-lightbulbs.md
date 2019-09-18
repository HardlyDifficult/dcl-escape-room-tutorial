# 07-lightbulbs

Start with [07-lightbulb-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/07-lightbulb-playground)

Resources:
- [07-lightbulb-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/07-lightbulb-complete)

## Custom Components

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/ili9BrPVLWU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Start off by creating a new folder called `components` inside of the `src` folder and add a new file called toggleModelComponent.ts:

```typescript
@Component("toggleModelComponent")
export class ToggleModelComponent {
  private onModel: GLTFShape;
  private offModel: GLTFShape;

  constructor(entity: IEntity, onModel: GLTFShape, offModel: GLTFShape) {
    this.onModel = onModel;
    const onEntity = new Entity();
    onEntity.addComponent(this.onModel);
    onEntity.setParent(entity);

    this.offModel = offModel;
    const offEntity = new Entity();
    offEntity.addComponent(this.offModel);
    offEntity.setParent(entity);

    this.onModel.visible = false;
  }

  isOn(): boolean {
    return this.onModel.visible;
  }

  toggle() {
    if (this.isOn()) {
      this.onModel.visible = false;
      this.offModel.visible = true;
    } else {
      this.offModel.visible = false;
      this.onModel.visible = true;
    }
  }
}
```

Create a new file inside of the `gameObjects` folder called `toogleEntity.ts`:

```typescript
import { ToggleModelComponent } from "../components/toggleModelComponent";

export class ToggleEntity extends Entity {
  constructor(
    transform: TranformConstructorArgs,
    onModel: GLTFShape,
    offModel: GLTFShape
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(new ToggleModelComponent(this, onModel, offModel));
  }
}
```

Now inside of `room7.ts`and create an array of toggleEntities for the lightbulbs:

```typescript
// Puzzle Lightbulbs
const lightbulbs: ToggleEntity[] = [];
for (let i = 0; i < 4; i++) {
  lightbulbs.push(
    new ToggleEntity(
      { position: bulbPositions[i] },
      new GLTFShape(resources.models.lightOnSrc),
      new GLTFShape(resources.models.lightOffSrc)
    )
  );
}
```

Now create an array of callback functions for the buttons:

```typescript
const buttonInteractions = [
  (): void => {
    lightbulbs[1].getComponent(ToggleModelComponent).toggle();
    lightbulbs[2].getComponent(ToggleModelComponent).toggle();
    lightbulbs[3].getComponent(ToggleModelComponent).toggle();
  },
  (): void => {
    lightbulbs[2].getComponent(ToggleModelComponent).toggle();
    lightbulbs[3].getComponent(ToggleModelComponent).toggle();
  },
  (): void => {
    lightbulbs[0].getComponent(ToggleModelComponent).toggle();
    lightbulbs[3].getComponent(ToggleModelComponent).toggle();
  },
  (): void => {
    lightbulbs[0].getComponent(ToggleModelComponent).toggle();
    lightbulbs[2].getComponent(ToggleModelComponent).toggle();
    lightbulbs[3].getComponent(ToggleModelComponent).toggle();
  }
];
```

Create a helper method that will tell if the lightbulbs are all on:

```typescript
const areAllLightsOn = (): boolean => {
  for (const bulb of lightbulbs) {
    if (!bulb.getComponent(ToggleModelComponent).isOn()) {
      return false;
    }
  }
  return true;
};
```

Add another toggleEntity for a TV screen that will display the hint message:

```typescript
// The TV displays the hint when toggled on
const tvScreen = new ToggleEntity(
  { position: new Vector3(26.91, 0, 10.44) },
  resources.models.tvOn,
  resources.models.tvOff
);
```

Finally create an array of buttons with OnClick events that will toggle the lights and check if they are all on, then create a variable that will help disable all the buttons:

```typescript
let areButtonsEnabled = true;
for (let i = 0; i < buttonPositions.length; i++) {
  const button = new Button(resources.models.roundButton, {
    position: buttonPositions[i]
  });
  button.addComponent(
    new OnClick((): void => {
      if (areButtonsEnabled) {
        buttonInteractions[i]();
        button.press();

        if (areAllLightsOn()) {
          areButtonsEnabled = false;
          tvScreen.getComponent(ToggleModelComponent).toggle();
        }
      }
    })
  );
}
```
