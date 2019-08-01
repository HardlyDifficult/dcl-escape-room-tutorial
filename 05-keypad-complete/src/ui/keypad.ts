import resources from "../resources";
import { CloseImage } from "./closeImage";
import { ToggleDoor } from "../gameObjects/toggleDoor";

const panelPosition = new Vector2(12, -24);
const buttonSize = new Vector2(55, 55);
const buttonSpace = new Vector2(5, 5);

export class Keypad extends UIContainerRect {
  private background: UIImage;

  private password = "155";
  private currentIndex = 0;

  constructor(canvas: UICanvas, door: ToggleDoor) {
    // Creating UI Container
    super(canvas);
    this.visible = false;

    // Setting Position
    this.positionX = -50;
    this.positionY = 50;

    // Setting Width and Height
    this.width = "100%";
    this.height = "100%";

    // Creating Keypad Background
    this.background = new UIImage(this, resources.textures.keypadBackground);

    // Setting Source Width and Height
    this.background.sourceWidth = 918;
    this.background.sourceHeight = 1300;

    // Setting Width and Height
    this.background.width = 310;
    this.background.height = 420;

    // Creating Close Button
    new CloseImage(this, new Vector2(194, 108));
  }
}
