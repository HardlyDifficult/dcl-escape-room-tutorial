# 06-dialog

Start with [06-dialog-playground](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/06-dialog-playground)

Resources:
- [06-dialog-complete](https://github.com/HardlyDifficult/dcl-escape-room-tutorial/tree/master/06-dialog-complete)

## Displaying Clues

<center>
	<iframe width="560" height="315" src="https://www.youtube.com/embed/8RhFb06ZzfY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Start off inside of inside `room6.ts` by adding a door and a statue as a MovableEntity:

```typescript
const door = new Door(
  resources.models.door6,
  {
  	position: new Vector3(28.3, 0.25, 19.75),
  	rotation: Quaternion.Euler(0, 180, 0),
  },
  resources.sounds.doorSqueak
);

const munaStatue = new MovalbeEntity(
  resrouces.models.muna,
  { position: new Vector3(26.748, 0.1054, 20.765) },
  resources.sounds.moveObject1,
  new Vector3(0, 0, 2),
  1.5
);
```

Then add a keypad similar to `room5.ts` and wire up the input logic:

```typescript
// Prep the keypad UI
const keypad = new Keypad(gameCanvas);
keypad.container.visible = false;

// Add a panel which opens the UI when clicked
const numPadLock = new NumPadLock(resources.models.numpad2);
numPadLock.addComponent(
  new OnClick((): void => {
    keypad.container.visible = true;
  })
);

// Wire up the keypad logic
let currentInput = "";
keypad.onInput = (value: number): void => {
  currentInput += value;
  keypad.display(currentInput);
  numPadLock.playButtonPressed();
};
keypad.onReset = (): void => {
  currentInput = "";
  keypad.display(currentInput);
  numPadLock.playButtonPressed();
};
keypad.onSubmit = (): void => {
  if (currentInput == "104") {
    // Correct!
    keypad.display("OK!", Color4.Green());
    numPadLock.playAccessGranted();
    numPadLock.removeComponent(OnClick);
    munaStatue.getComponent(utils.ToggleComponent).toggle();
    numPadLock.addComponentOrReplace(
      new utils.Delay(2000, (): void => {
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

Inside of the `gameObjects` folder add a new file called `spotlight.ts`:

```typescript
import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Spotlight extends Entity {
  constructor(transform: TranformConstructorArgs, hiddenNumberValue: string) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(new AudioSource(resources.sounds.spotlight));

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, value => {
        if (value == utils.ToggleState.On) {
          this.addComponent(resources.models.spotlight);

          const hiddenNumber = new Entity();
          hiddenNumber.addComponent(new TextShape());
          hiddenNumber.getComponent(TextShape).value = hiddenNumberValue;
          hiddenNumber.getComponent(TextShape).fontSize = 5;

          hiddenNumber.setParent(this);
          hiddenNumber.addComponent(
            new Transform({ position: new Vector3(0, 0.9, -0.4) })
          );

          this.getComponent(AudioSource).playOnce();
        }
      })
    );
  }
}
```

Now back in `room6.ts` add some spotlights around the muna statue:

```typescript
// Spotlights
const spotLight1 = new Spotlight(
  {
    position: new Vector3(-0.04, 0, 0)
  },
  "1"
);
spotLight1.setParent(munaStatue);
const spotLight2 = new Spotlight(
  {
    position: new Vector3(-0.02, 0, 0),
    rotation: Quaternion.Euler(0, 90, 0)
  },
  "0"
);
spotLight2.setParent(munaStatue);
const spotLight3 = new Spotlight(
  {
    position: new Vector3(-0.03, 0, 0),
    rotation: Quaternion.Euler(0, 180, 0)
  },
  "4"
);
spotLight3.setParent(munaStatue);
```

Inside of the `ui` folder add a new file called `munaDialog.ts`:

```typescript
import resources from "../resources";
import { SimpleDialog } from "../modules/simpleDialog";

function selectRandom(options: string[]): string {
  return options[Math.floor(Math.random() * (options.length - 1))];
}

export class MunaDialog extends SimpleDialog {
  private dialogTree: SimpleDialog.DialogTree;

  public onCorrectAnswer: (questionId: number) => void;

  constructor(gameCanvas: UICanvas) {
    // Create a new SimpleDialog to manage the dialog tree
    super({
      canvas: gameCanvas,
      leftPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "-17%"
      },
      rightPortrait: {
        width: 256,
        height: 256,
        sourceWidth: 256,
        sourceHeight: 256,
        positionX: "15%"
      },
      dialogText: {
        width: "25%",
        height: "25%",
        textSpeed: 15,
        textIdleTime: 5,
        textConfig: { fontSize: 16, paddingLeft: 25, paddingRight: 25 },
        background: resources.textures.textContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 257 }
      },
      optionsContainer: {
        stackOrientation: UIStackOrientation.VERTICAL,
        spacing: 0,
        width: "40%",
        height: "12%",
        vAlign: "top",
        hAlign: "center",
        positionY: "-65%",
        background: resources.textures.optionsContainer,
        backgroundConfig: { sourceWidth: 512, sourceHeight: 79 },
        optionsTextConfig: { fontSize: 20, paddingLeft: 20, positionY: "-35%" }
      }
    });

    // Some random replies for muna
    const randomStartingOptions = ["I see...", "...", "...OK..."];
    const randomWrongAnswers = [
      "You are just guessing...",
      "No it is not...",
      "What? Not even close!"
    ];

    // Variables used in the dialog tree
    let firstTimeDialog = true;
    let firstOptionCorrect = false;
    let secondOptionCorrect = false;
    let thirdOptionCorrect = false;

    // Dialog text colors
    const npcColor = Color4.White();
    const playerColor = new Color4(0.898, 0, 0.157);

    this.dialogTree = new SimpleDialog.DialogTree()
      .if(() => firstTimeDialog)
      .call(() => (firstTimeDialog = false))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .say(() => "Hi there stranger!", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitSurprised
      )
      .say(() => "A talking dog statue?!", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(
        () =>
          "You're a talking bear yourself... you don't see me making any judgements.",
        { color: npcColor }
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .say(() => "Anyway... how do I get out of this place?", {
        color: playerColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .say(
        () =>
          "You'll have to pass through me. And I'll only let you if you answer my three questions.",
        { color: npcColor }
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitSurprised
      )
      .say(
        () =>
          "So go ahead, explore the other rooms and solve the puzzles to find the answers to my questions!",
        { color: npcColor }
      )
      .say(() => "Um... sure, why not? Who am I to argue?", {
        color: playerColor
      })
      .wait(3)
      .else()
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .if(() => firstOptionCorrect && secondOptionCorrect && thirdOptionCorrect)
      .say(() => "We're done talking. \nEnter the code and you can leave.", {
        color: npcColor
      })
      .wait(3)
      .else()
      .say(() => "Did you solve my puzzles? Do you know the answers?", {
        color: npcColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Yes.")
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .say(() => "Yes. Why do you think I came all the way down here?", {
        color: playerColor
      })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomStartingOptions), { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitThinking
      )
      .say(() => "Very well then... answer me this:", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitDefault
      )
      .if(() => !firstOptionCorrect)
      .say(() => "What’s my favorite color?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Green.")
      .say(() => "Is it green?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Blue.")
      .say(() => "Blue... right?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Orange.")
      .say(() => "Organge!", { color: playerColor })
      .call(() => (firstOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "That’s right!", { color: npcColor })
      .say(() => '"In the midst of darkness, light persists."', {
        color: npcColor
      })
      .call(() => this.onCorrectAnswer(0))
      .endOption()
      .endOptionsGroup()
      .else()
      .if(() => !secondOptionCorrect)
      .say(() => "What’s my favorite game?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Retro arcade games.")
      .say(() => "Is it retro arcade games?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Darts.")
      .say(() => "Darts?", { color: playerColor })
      .call(() => (secondOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "Yes it is...", { color: npcColor })
      .say(() => '"Give light, and the darkness will disappear of itself."', {
        color: npcColor
      })
      .call(() => this.onCorrectAnswer(1))
      .endOption()
      .option(() => "- Bowling.")
      .say(() => "Of course… It’s bowling... right?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .endOptionsGroup()
      .else()
      .if(() => !thirdOptionCorrect)
      .say(() => "What’s my favorite dessert?", { color: npcColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitThinking
      )
      .beginOptionsGroup()
      .option(() => "- Cheese Cake.")
      .say(() => "Cheese Cake?", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Apple Pie.")
      .say(() => "It's Apple Pie...", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => selectRandom(randomWrongAnswers), { color: npcColor })
      .endOption()
      .option(() => "- Lemon Pie.")
      .say(() => "Lemon Pie!", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .call(() => (thirdOptionCorrect = true))
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "Very good...", { color: npcColor })
      .say(() => '"Give light and people will find the way."')
      .call(() => this.onCorrectAnswer(2))
      .endOption()
      .endOptionsGroup()
      .endif()
      .endif()
      .endif()
      .endOption()
      .option(() => "- No, not yet")
      .showPortrait(
        SimpleDialog.PortraitIndex.LEFT,
        resources.textures.playerPortraitDefault
      )
      .say(() => "No, not yet", { color: playerColor })
      .showPortrait(
        SimpleDialog.PortraitIndex.RIGHT,
        resources.textures.npcPortraitSurprised
      )
      .say(() => "You are wasting my time.", { color: npcColor })
      .endOption()
      .endOptionsGroup()
      .endif();
  }

  public run(): void {
    if (!this.isDialogTreeRunning()) {
      this.runDialogTree(this.dialogTree);
    }
  }
}
```

Now create a new munaDialog inside of `room6.ts` and wire the logic for onCorrectAnswer:

```typescript
// Define the dialog tree
const dialog = new MunaDialog(gameCanvas);

// Kick off the dialog when the statue is clicked
munaStatue.addComponent(
  new OnClick((): void => {
    dialog.run();
  })
);

// Reveal the hints as the player answers questions correctly.
dialog.onCorrectAnswer = (questionId: number) => {
  if (questionId === 0) {
    spotLight1.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  } else if (questionId === 1) {
    spotLight2.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  } else {
    spotLight3.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  }
};
```
