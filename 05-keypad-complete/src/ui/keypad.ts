import resources from "../resources";
import { CloseImage } from "./closeImage";
import { KeypadButton } from "./keypadButton";
import { KeypadDisplay } from "./keypadDisplay";

const panelPosition = new Vector2(12, -24);

/*
 * ToDo: Sound needs to be added, with this not being an Entity it's not going to be strait forward =<
 * Also cannot get the button input to work, I always get some error about it being undefined or something stupid
 * I suspect it's because I'm in a constructor or not in an entity?
 */
export class Keypad extends UIContainerRect {
  private currentIndex = 0;
  private password = "155";

  private display: KeypadDisplay[];

  constructor(parent: UICanvas, onPassed?: () => void) {
    super(parent);

    // Setting Container Width and Height
    this.positionX = -50;
    this.positionY = 50;
    this.width = "100%";
    this.height = "100%";
    this.visible = false;

    // Creating Background
    const panelBg = new UIImage(this, resources.textures.panelBackground);
    panelBg.sourceWidth = 918;
    panelBg.sourceHeight = 1300;
    panelBg.width = 310;
    panelBg.height = 420;
    panelBg.positionX = 70;
    panelBg.positionY = -55;

    // Creating Display
    this.display = [];
    for (let i = 0; i < 3; i++) {
      this.display.push(new KeypadDisplay(this, new Vector2(i * 60 + 5, 45)));
    }

    // Creating Close Button
    new CloseImage(this, new Vector2(194, 108));

    // Creating 0-9 Buttons
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 4; row++) {
        let number = row * 3 + col + 1;
        let pos = new Vector2(
          panelPosition.x + col * 60,
          panelPosition.y - row * 60
        );

        if (row < 3 || col == 1) {
          // Special case for 0
          if (row == 3 && col == 1) {
            number = 0;
          }

          // Error Occurs Here
          let button = new KeypadButton(
            this,
            pos,
            number,
            (str: string): void => {
              this.InputText(str);
            }
          );
        }
      }
    }

    // Creating Clear Button
    let clear = this.CreateButton(
      resources.textures.clearButton,
      new Vector2(panelPosition.x, panelPosition.y - 3 * 60)
    );
    clear.onClick = new OnClick((): void => {
      this.display.forEach(element => {
        element.text.value = "";
      });
      this.SetColour(Color4.White());
      this.currentIndex = 0;
    });

    // Creating Enter Button
    let enter = this.CreateButton(
      resources.textures.enterButton,
      new Vector2(panelPosition.x + 2 * 60, panelPosition.y - 3 * 60)
    );
    enter.onClick = new OnClick((): void => {
      if (this.CheckPassword()) {
        this.SetColour(Color4.Green());
        this.SetDisplay("OK!");

        onPassed.call(null);
        this.currentIndex = 3;
      } else {
        this.SetColour(Color4.Red());
        this.SetDisplay("Err");

        this.currentIndex = 3;
      }
    });
  }

  // Function checks if Password is Correct and will return True if so
  private CheckPassword = function(): boolean {
    for (let i = 0; i < 3; i++) {
      if (this.display[i].text.value != this.password[i]) {
        return false;
      }
    }
    return true;
  };

  // Function sets the Display Text of the Keypad
  private SetDisplay = function(text: string): void {
    for (let i = 0; i < 3; i++) {
      this.display[i].text.value = text[i];
    }
  };
  // Function sets the Colour of the Display Text
  private SetColour = function(colour: Color4): void {
    this.display.forEach(element => {
      element.text.color = colour;
    });
  };

  // Function to easily Create Additional buttons (Clear & Enter)
  private CreateButton = function(image: Texture, position: Vector2): UIImage {
    let result = new UIImage(this, image);
    result.sourceWidth = 171;
    result.sourceHeight = 171;
    result.width = 55;
    result.height = 55;
    result.positionX = position.x;
    result.positionY = position.y;

    return result;
  };
  // Function to add a String to the Display
  private InputText = function(value: string): void {
    if (this.currentIndex < 3) {
      this.display[this.currentIndex].text.value = value;
      this.currentIndex++;
    }
  };
}
