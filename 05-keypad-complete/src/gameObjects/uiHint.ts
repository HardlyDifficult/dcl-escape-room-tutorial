import resources from "../resources";

export class UIHint extends Entity {
  private uiContainer: UIContainerRect;

  constructor(gameCanvas: UICanvas, hintImagePath: string) {
    super();
    engine.addEntity(this);

    this.uiContainer = new UIContainerRect(gameCanvas);

    this.uiContainer.width = "100%";
    this.uiContainer.height = "100%";

    const hintImage = new UIImage(this.uiContainer, new Texture(hintImagePath));
    hintImage.sourceWidth = 392;
    hintImage.sourceHeight = 512;
    hintImage.width = 261;
    hintImage.height = 341;

    // Add a close button near the top right
    const closeImage = new UIImage(
      this.uiContainer,
      resources.closeButtonTexture
    );
    closeImage.sourceWidth = 32;
    closeImage.sourceHeight = 32;
    closeImage.width = 32;
    closeImage.height = 32;
    closeImage.positionX = 164;
    closeImage.positionY = 224;
    // When close, hide the UI
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
