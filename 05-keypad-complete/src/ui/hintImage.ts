import { CloseImage } from "./closeImage";

export class HintImage extends UIContainerRect {
  private hintImage: UIImage;

  constructor(gameCanvas: UICanvas, texture: Texture) {
    // Creating UI Container
    super(gameCanvas);

    // Setting Container Width and Height
    this.width = "100%";
    this.height = "100%";
    this.visible = false;

    // Creating Hint Image for UI Container
    this.hintImage = new UIImage(this, texture);

    // Setting Image Width and Height
    this.hintImage.sourceWidth = 512;
    this.hintImage.sourceHeight = 512;
    this.hintImage.width = 512;
    this.hintImage.height = 512;

    // Creating Close Button
    new CloseImage(this, new Vector2(256, 256));
  }
}
