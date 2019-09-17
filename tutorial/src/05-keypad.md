# 05-keypad

Start with [05-keypad-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/05-keypad-playground)

Resources
- [05-keypad-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/05-keypad-complete)

## Displaying UI

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/4Q5in69Jqgw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Inside of `game.ts` create a new `UICanvas` called gameCanvas:

```typescript
const gameCanvas = new UICanavs();

new BaseScene();
CreateRoom5(gameCanvas);
```

Switch over to `room5.ts` and add the canvas as a parameter and add in the door:

```typescript
export function CreateRoom5(gameCanvas: UICanvas): void {
  const door = new Door(
  	resources.models.door5,
  	{ position: new Vector3(19.5141, 5.54709, 25.676) },
  	resources.sounds.doorSqueak
  );
}
```

Create a new GameObject inside of the `gameObject` folder called `model.ts`:

```typescript
export class Model extends Entity {
  constructor(model: GLTFShape, transform: TranformConstructorArgs) {
  	super();
  	engine.addEntity(this);
  
  	this.addComponent(new Transform(transform));
  	this.addComponent(model);
  }
}
```

Now in `room5.ts` add a new Model for the picture frame:

```typescript
const painting = new Model(resources.models.pictureFrame,
{ position: new Vector3(22.2283, 7.60325, 20.9326) });
```

In the `src` folder create a new folder called `ui` and add a file called `imageHint.ts`:

```typescript
import resources from "../resources";

export class ImageHint {
  // Expose the container for changing visibility
  public container: UIContainerRect;

  constructor(gameCanvas: UICanvas, texture: Texture) {
    this.container = new UIContainerRect(gameCanvas);
    this.container.width = "100%";
    this.container.height = "100%";

    // Add the primary image
    const hintImage = new UIImage(this.container, texture);
    hintImage.sourceWidth = 512;
    hintImage.sourceHeight = 512;
    hintImage.width = 512;
    hintImage.height = 512;

    // And a close button to the top right
    const close = new UIImage(
      this.container,
      resources.textures.closeHintButton
    );
    close.sourceWidth = 92;
    close.sourceHeight = 92;
    close.width = 46;
    close.height = 46;
    close.positionX = 256;
    close.positionY = 256;

    // UI has a different way of registering OnClick support
    close.onClick = new OnClick((): void => {
      this.container.visible = false;
    });
  }
}
```

Go back to `room5.ts` and add a new ImageHint for the picture frame and add an OnClick to enable the HintImage:

```typescript
const painting = new Model(resources.models.pictureFrame,
{ position: new Vector3(22.2283, 7.60325, 20.9326) });

const paintingHint = new ImageHint(gameCanvase, resources.textures.fernHint);
paintingHint.container.visible = false;

painting.addComponent(new OnClick((): void =>{
  paintingHint.container.visible = true;
}));
```

Now add a `rotateableEntity` to add a carpet that will hide the second hint:

```typescript
// And a carpet which covers a postit note
const carpet = new RotatableEntity(
  resources.models.carpet,
  {
    position: new Vector3(20.7079, 5.50579, 24.6273),
    rotation: Quaternion.Identity
  },
  undefined,
  Quaternion.Euler(0, -10, 0)
);
carpet.addComponent(
  new OnClick((): void => {
    carpet.getComponent(utils.ToggleComponent).toggle();
  })
);
```

Then add a second hint, hidden under the carpet with an OnClick similar to the picture frame:

```typescript
// The postit contains the second hint
const postit = new Model(resources.models.postit, {
  position: new Vector3(21.571, 5.50857, 25.9534)
});

const postitHint = new ImageHint(gameCanvas, resources.textures.postitHint);
postitHint.container.visible = false;
postit.addComponent(
  new OnClick((): void => {
    postitHint.container.visible = true;
  })
);
```

## Creating a Number Pad

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/watch?v=qwPsDoxzyG4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Inside of the `gameObject` folder add a new file called `numPadLock.ts`:

```typescript
import resources from "../resources";

export class NumPadLock extends Entity {
  constructor(model: GLTFShape) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
  }

  public playButtonPressed(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.button)
    );
    clip.playOnce();
  }

  public playAccessGranted(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.accessGranted)
    );
    clip.playOnce();
  }

  public playAccessDenied(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.accessDenied)
    );
    clip.playOnce();
  }
}
```

Inside of the `ui` folder create a new file called `keypad.ts`:

```typescript
import resources from "../resources";

// Constants for positioning
const panelPosition = new Vector2(12, -24);
const buttonSize = new Vector2(55, 55);
const buttonSpace = new Vector2(5, 5);

export class Keypad {
  // Expose the container for changing visibility
  public container: UIContainerRect;

  private panelInputs: UIText[];

  /**
   * Called when a value key is pressed.
   */
  public onInput: (value: number) => void;

  /**
   * Called when the reset button is pressed.
   */
  public onReset: () => void;

  /**
   * Called when the submit button is pressed.
   */
  public onSubmit: () => void;

  constructor(parent: UIShape) {
    this.container = new UIContainerRect(parent);
    this.container.positionX = -50;
    this.container.positionY = 50;
    this.container.width = "100%";
    this.container.height = "100%";

    // Display an image in the background for the keypad UI
    const panelBackground = new UIImage(
      this.container,
      resources.textures.panelBackground
    );
    panelBackground.sourceWidth = 918;
    panelBackground.sourceHeight = 1300;
    panelBackground.width = 310;
    panelBackground.height = 420;
    panelBackground.positionX = 70;
    panelBackground.positionY = -55;

    // Add a close button near the top right
    const closeImage = new UIImage(
      this.container,
      resources.textures.closeButton
    );
    closeImage.sourceWidth = 92;
    closeImage.sourceHeight = 92;
    closeImage.width = 32;
    closeImage.height = 32;
    closeImage.positionX = 194;
    closeImage.positionY = 108;

    // When close is clicked, hide the UI
    closeImage.onClick = new OnClick((): void => {
      this.container.visible = false;
    });

    // 3 boxes to show the entered code or current message
    this.panelInputs = [];
    for (let i = 0; i < 3; i++) {
      const inputImage = new UIImage(
        this.container,
        resources.textures.inputBox
      );
      const inputSlot = new UIText(this.container);
      inputImage.sourceWidth = 173;
      inputImage.sourceHeight = 173;
      inputImage.width = inputSlot.width = buttonSize.x;
      inputImage.height = inputSlot.height = buttonSize.y;
      inputImage.positionX = inputSlot.positionX =
        i * (buttonSpace.x + buttonSize.x) + 5;
      inputImage.positionY = inputSlot.positionY = 45;
      inputSlot.fontAutoSize = true;
      inputSlot.hTextAlign = "center";
      this.panelInputs.push(inputSlot);
    }

    // User input buttons
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 4; row++) {
        // The value this button represents
        let value: number;
        if (col == 1 && row == 3) {
          // The 0 button is a special case
          value = 0;
        } else {
          value = row * 3 + col + 1;
        }

        // Create the button and its event
        let buttonImage: UIImage = null;
        if (col == 0 && row == 3) {
          // The clear button in the bottom left
          buttonImage = new UIImage(
            this.container,
            resources.textures.clearButton
          );

          // Call onReset when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onReset();
          });
        } else if (col == 2 && row == 3) {
          // The enter button in the bottom right
          buttonImage = new UIImage(
            this.container,
            resources.textures.enterButton
          );

          // Call onSubmit when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onSubmit();
          });
        } else {
          // A number value button
          buttonImage = new UIImage(
            this.container,
            resources.textures.numberButton
          );

          const numberText = new UIText(buttonImage);
          numberText.isPointerBlocker = false;
          numberText.positionX = -23;
          numberText.fontAutoSize = true;
          numberText.hTextAlign = "center";
          numberText.value = value.toString();

          // Call onInput when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onInput(value);
          });
        }

        // Configure button image
        buttonImage.sourceWidth = 171;
        buttonImage.sourceHeight = 171;
        buttonImage.width = buttonSize.x;
        buttonImage.height = buttonSize.y;
        buttonImage.positionX =
          panelPosition.x + col * (buttonSpace.x + buttonSize.x);
        buttonImage.positionY =
          panelPosition.y - row * (buttonSpace.y + buttonSize.y);
      }
    }
  }

  // Display a message above the keypad, up to 3 characters
  public display(message: string, color: Color4 = Color4.White()): void {
    for (let i = 0; i < this.panelInputs.length; i++) {
      const character = message.length > i ? message[i] : "";
      this.panelInputs[i].value = character;
      this.panelInputs[i].color = color;
    }
  }
}
```

Going back to `room5.ts` add the keypad ui and the numpad object:

```typescript
const keypad = new Keypad(gameCanvas);
keypad.container.visible = false;

const numPadLock = new NumPadLock(resources.models.numpad1);
numPadLock.addComponent(new OnClick((): void =>{
	keypad.container.visible = true;
}));
```

Now create a variable to store the Player's input and add an event to record it:

```typescript
// Wire up the keypad logic
let currentInput = "";
keypad.onInput = (value: number): void => {
  currentInput += value;
  keypad.display(currentInput);
  numPadLock.playButtonPressed();
};
```

Underneath that an events for resetting the input and submitting the input:

```typescript
keypad.onReset = (): void => {
    currentInput = "";
    keypad.display(currentInput);
    numPadLock.playButtonPressed();
};
keypad.onSubmit = (): void => {
  if (currentInput == "155") {
    // Correct!
    keypad.display("OK!", Color4.Green());
    numPadLock.playAccessGranted();
    numPadLock.addComponentOrReplace(
      new utils.ExpireIn(2000, (): void => {
        keypad.container.visible = false;
        door.openDoor();
      })
    );
  } else {
    // The password is incorrect
    keypad.display("Err", Color4.Red());
    numPadLock.playAccessDenied();
    currentInput = "";
  }
};
```
