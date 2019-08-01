import resources from "../resources";

export class CloseImage extends UIImage {
  constructor(container: UIContainerRect, position: Vector2) {
    // Creating UI Image
    super(container, resources.textures.closeHintButton);

    // Setting Source Width and Height
    this.sourceWidth = 92;
    this.sourceHeight = 92;

    // Setting Width and Height
    this.width = 46;
    this.height = 46;

    // Setting Position
    this.positionX = position.x;
    this.positionY = position.y;

    // Creating OnClick Event
    this.onClick = new OnClick((): void => {
      container.visible = false;
    });
  }
}
