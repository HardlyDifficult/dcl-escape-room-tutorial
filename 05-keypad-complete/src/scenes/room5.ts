import GameObjects from "../gameObjects/index";
import UI from "../ui/index";

const password = "155";

export function CreateRoom5(gameCanvas: UICanvas): void {
  /**
   * Core scene elemets
   */

  // A wall to place things on
  new GameObjects.Wall({
    position: new Vector3(19, 1.4, 13.1),
    scale: new Vector3(4, 3, 1)
  });

  // The door to unlock
  const door = new GameObjects.Door({
    position: new Vector3(25, 0, 10),
    rotation: Quaternion.Euler(0, 90, 0)
  });

  /**
   * Painting
   */

  // The painting on the wall
  const painting = new GameObjects.Painting({
    position: new Vector3(18, 1.5, 13),
    scale: new Vector3(0.7, 1, 1),
    rotation: Quaternion.Euler(0, 0, 180)
  });

  // The painting hint
  const paintingHint = new UI.PaintingHint(gameCanvas);
  paintingHint.hide();

  // When the painting is clicked, show the hint
  painting.addComponent(
    new OnClick((): void => {
      paintingHint.show();
    })
  );

  /**
   * Carpet & Coin
   */

  // The coin to be hidden under the carpet
  const coin = new GameObjects.Coin({ position: new Vector3(18, 0, 10.5) });

  // The carpet on-top of the coin
  const carpet = new GameObjects.Carpet({ position: new Vector3(19, 0, 11) });

  // When the carpet is clicked, toggle rotation which will reveal the coin
  carpet.addComponent(
    new OnClick((): void => {
      carpet.rotateCarpet();
    })
  );

  // The coin hint
  const coinHint = new UI.CoinHint(gameCanvas);
  coinHint.hide();

  // When the coin is clicked, show the hint
  coin.addComponent(
    new OnClick((): void => {
      coinHint.show();
    })
  );

  /**
   * Keypad
   */

  // The keypad on the wall
  const keypad = new GameObjects.Keypad({
    position: new Vector3(19.5, 1.5, 13)
  });

  // UI for interacting with the keypad
  const keypadUI = new UI.KeypadUI(gameCanvas);
  keypadUI.hide();

  // When the keypad on the wall is clicked, display the UI
  keypad.addComponent(
    new OnClick((): void => {
      keypadUI.show();
    })
  );

  // Wire up the keypad UI
  let currentInput = "";
  keypadUI.onInput = (value: number): void => {
    currentInput += value;
    keypadUI.display(currentInput);
    keypad.playButtonPressed();
  };
  keypadUI.onReset = (): void => {
    currentInput = "";
    keypadUI.display(currentInput);
    keypad.playButtonPressed();
  };
  keypadUI.onSubmit = (): void => {
    if (currentInput == password) {
      // Correct!
      keypadUI.display("OK!", Color4.Green());
      keypad.playAccessGranted();
      door.openDoor();
    } else {
      // The password is incorrect
      keypadUI.display("Err", Color4.Red());
      currentInput = "";
      keypad.playAccessDenied();
    }
  };
}
