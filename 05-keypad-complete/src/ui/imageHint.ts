import resources from "../resources";

export class ImageHint {
  // Expose the container for changing visibility
  public container: UIContainerRect;

  private hintImage: UIImage;

  constructor(gameCanvas: UICanvas, texture: Texture) {
    this.container = new UIContainerRect(gameCanvas);    
    this.container.width = "100%";
    this.container.height = "100%";

    // Add the primary image
    this.hintImage = new UIImage(this.container, texture);
    this.hintImage.sourceWidth = 512;
    this.hintImage.sourceHeight = 512;
    this.hintImage.width = 512;
    this.hintImage.height = 512;

    // And a close button to the top right
    const close = new UIImage(this.container, resources.textures.closeHintButton);
    close.sourceWidth = 92;
    close.sourceHeight = 92;
    close.width = 46;
    close.height = 46;
    close.positionX = 256;
    close.positionY = 256;

    // UI has a different way of registering OnClick support
    close.onClick = new OnClick((): void => {
      this.container.visible = false;
    });
  }
}
