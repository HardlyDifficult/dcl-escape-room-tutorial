import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import {
  MovableEntity,
  NumPadLock,
  Door,
  Spotlight
} from "../gameObjects/index";
import { Keypad, MunaDialog } from "../ui/index";

export function CreateRoom6(gameCanvas: UICanvas): void {
  const door = new Door(
    resources.models.door6,
    {
      position: new Vector3(28.3, 0.25, 19.75),
      rotation: Quaternion.Euler(0, 180, 0)
    },
    resources.sounds.doorSqueak
  );

  // A statue blocks the doorway
  const munaStatue = new MovableEntity(
    resources.models.muna,
    { position: new Vector3(26.748, 0.1054, 20.765) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, 2),
    1.5
  );

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
}
