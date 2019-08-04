import resources from "../resources";

export class KeypadDisplay extends UIImage {
  public text: UIText;
  constructor(parent: UIContainerRect, position: Vector2) {
    super(parent, resources.textures.inputBox);
    this.text = new UIText(parent);

    this.sourceWidth = 173;
    this.sourceHeight = 173;
    this.width = this.text.width = 55;
    this.height = this.text.height = 55;

    this.positionX = this.text.positionX = position.x;
    this.positionY = this.text.positionY = position.y;

    this.isPointerBlocker = this.text.isPointerBlocker = false;

    this.text.fontAutoSize = true;
    this.text.hTextAlign = "center";
    this.text.value = "";
    this.text.color = Color4.White();
  }
}
