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
      .call(() => this.onCorrectAnswer(0))
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
