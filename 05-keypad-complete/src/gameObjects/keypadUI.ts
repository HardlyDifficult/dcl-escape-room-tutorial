import resources from "../resources";

// Resources which are used multiple times below, to improve performance.
const buttonTexture = new Texture("images/codepad/pwdpanel_buttons.png");
const inputTexture = new Texture("images/codepad/pwdpanel_input.png");

// Buttons Size
const buttonSize = new Vector2(64, 64);
// Space between Buttons
const buttonSpace = new Vector2(5, 5);

export class KeypadUI extends Entity {
  private uiContainer: UIContainerRect;
  private panelInputs: { image: UIImage; text: UIText }[];

  /**
   * Called when a value key is pressed.
   */
  onInput: (character: string) => void;

  /**
   * Called when the reset button is pressed.
   */
  onReset: () => void;

  /**
   * Called when the submit button is pressed.
   */
  onSubmit: () => void;

  constructor(gameCanvas: UICanvas) {
    super();
    engine.addEntity(this);

    // Create a full screen container
    this.uiContainer = new UIContainerRect(gameCanvas);
    this.uiContainer.width = "100%";
    this.uiContainer.height = "100%";

    // Display an image in the background for the keypad UI
    const panelBackground = new UIImage(
      this.uiContainer,
      new Texture("images/codepad/pwdpanel_bg.png")
    );
    panelBackground.sourceWidth = 222;
    panelBackground.sourceHeight = 297;
    panelBackground.width = 310;
    panelBackground.height = 420;
    panelBackground.positionX = 70;
    panelBackground.positionY = -55;

    // A close button near the top right
    const closeImage = new UIImage(
      this.uiContainer,
      resources.closeButtonTexture
    );
    closeImage.sourceWidth = 32;
    closeImage.sourceHeight = 32;
    closeImage.width = 32;
    closeImage.height = 32;
    closeImage.positionX = 204;
    closeImage.positionY = 133;
    closeImage.onClick = new OnClick((): void => {
      this.hide();
    });

    // Title text on the top
    const panelText = new UIText(this.uiContainer);
    panelText.value = "Enter Code";
    panelText.positionY = 140;
    panelText.positionX = 36;
    panelText.fontSize = 30;

    // 3 boxes to show the entered code or current message
    this.panelInputs = [];
    for (let i = 0; i < 3; i++) {
      const inputSlot = {
        image: new UIImage(this.uiContainer, inputTexture),
        text: new UIText(this.uiContainer)
      };
      inputSlot.image.sourceWidth = 64;
      inputSlot.image.sourceHeight = 64;
      inputSlot.image.width = inputSlot.text.width = buttonSize.x;
      inputSlot.image.height = inputSlot.text.height = buttonSize.y;
      inputSlot.image.positionX = inputSlot.text.positionX =
        i * (buttonSpace.x + buttonSize.x);
      inputSlot.image.positionY = inputSlot.text.positionY = 65;
      inputSlot.text.fontAutoSize = true;
      inputSlot.text.hTextAlign = "center";
      this.panelInputs.push(inputSlot);
    }

    // User input buttons
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 4; row++) {
        // The value this button represents
        let value;
        if (col == 1 && row == 3) {
          // The 0 button is a special case
          value = 0;
        } else {
          value = row * 3 + col + 1;
        }

        const position = new Vector2(
          col * (buttonSpace.x + buttonSize.x),
          -12 - row * (buttonSpace.y + buttonSize.y)
        );

        // Create the button and its event
        let buttonImage: UIImage = null;
        if (col == 0 && row == 3) {
          // The clear button in the bottom left
          buttonImage = new UIImage(
            this.uiContainer,
            new Texture("images/codepad/pwdpanel_clear.png")
          );

          // Call onReset when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onReset();
          });
        } else if (col == 2 && row == 3) {
          // The enter button in the bottom right
          buttonImage = new UIImage(
            this.uiContainer,
            new Texture("images/codepad/pwdpanel_enter.png")
          );

          // Call onSubmit when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onSubmit();
          });
        } else {
          // A number value button
          buttonImage = new UIImage(this.uiContainer, buttonTexture);

          const numberText = new UIText(this.uiContainer);
          numberText.isPointerBlocker = false;
          numberText.width = buttonImage.width;
          numberText.height = buttonImage.height;
          numberText.positionX = position.x;
          numberText.positionY = position.y;
          numberText.fontAutoSize = true;
          numberText.hTextAlign = "center";
          numberText.isPointerBlocker = false;
          numberText.value = value.toString();

          // Call onInput when clicked
          buttonImage.onClick = new OnClick((): void => {
            this.onInput(value.toString());
          });
        }

        // Configure button image
        buttonImage.sourceWidth = 64;
        buttonImage.sourceHeight = 64;
        buttonImage.width = buttonSize.x;
        buttonImage.height = buttonSize.y;
        buttonImage.positionX = position.x;
        buttonImage.positionY = position.y;
      }
    }
  }

  public show(): void {
    this.uiContainer.visible = true;
  }

  public hide(): void {
    this.uiContainer.visible = false;
  }

  public display(message: string, color: Color4 = Color4.Black()): void {
    for (let i = 0; i < this.panelInputs.length; i++) {
      let character = message.length > i ? message[i] : "";
      this.panelInputs[i].text.value = character;
      this.panelInputs[i].text.color = color;
    }
  }
}
