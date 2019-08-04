import resources from "../resources";

export class KeypadButton extends UIImage {
  constructor(
    parent: UIShape,
    position: Vector2,
    value: number,
    onClick: (str: string) => void
  ) {
    super(parent, resources.textures.numberButton);
    const text = new UIText(parent);

    this.sourceWidth = 171;
    this.sourceHeight = 171;

    this.width = text.width = 55;
    this.height = text.height = 55;

    this.positionX = text.positionX = position.x;
    this.positionY = text.positionY = position.y;

    text.value = value.toString();

    text.fontAutoSize = true;
    text.hTextAlign = "center";
    text.isPointerBlocker = false;

    this.onClick = new OnClick((): void => {
      onClick.call("0");
    });
  }
}
