import resources from "../resources";

export class PaintingHint {
  private uiContainer: UIContainerRect;

  constructor(parent: UIShape) {
    this.uiContainer = new UIContainerRect(parent);
    this.uiContainer.width = "100%";
    this.uiContainer.height = "100%";

    const hintImage = new UIImage(
      this.uiContainer,
      resources.textures.paintingHint
    );
    hintImage.sourceWidth = 392;
    hintImage.sourceHeight = 512;
    hintImage.width = 261;
    hintImage.height = 341;

    // Add a close button near the top right
    const closeImage = new UIImage(
      this.uiContainer,
      resources.textures.closeButton
    );
    closeImage.sourceWidth = 32;
    closeImage.sourceHeight = 32;
    closeImage.width = 32;
    closeImage.height = 32;
    closeImage.positionX = 164;
    closeImage.positionY = 224;

    // When close is clicked, hide the UI
    closeImage.onClick = new OnClick((): void => {
      this.hide();
    });
  }

  public show(): void {
    this.uiContainer.visible = true;
  }

  public hide(): void {
    this.uiContainer.visible = false;
  }
}
