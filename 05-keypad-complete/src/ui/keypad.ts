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
    const closeImage = new UIImage(this.container, resources.textures.closeButton);
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
      const inputImage = new UIImage(this.container, resources.textures.inputBox);
      const inputSlot = new UIText(this.container)
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
          buttonImage = new UIImage(this.container, resources.textures.clearButton);

          // Call onReset when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onReset();
          });
        } else if (col == 2 && row == 3) {
          // The enter button in the bottom right
          buttonImage = new UIImage(this.container, resources.textures.enterButton);

          // Call onSubmit when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onSubmit();
          });
        } else {
          // A number value button
          buttonImage = new UIImage(this.container, resources.textures.numberButton);

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

  public display(message: string, color: Color4 = Color4.White()): void {
    for (let i = 0; i < this.panelInputs.length; i++) {
      const character = message.length > i ? message[i] : "";
      this.panelInputs[i].value = character;
      this.panelInputs[i].color = color;
    }
  }
}
