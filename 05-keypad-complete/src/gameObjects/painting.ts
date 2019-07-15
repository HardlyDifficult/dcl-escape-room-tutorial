export class Painting extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new PlaneShape());
    this.addComponent(new Transform(transform));

    // Create a material for painting image
    let paintingMat = new Material();
    paintingMat.albedoTexture = new Texture("images/room4/fernpicture.png", {
      hasAlpha: true
    });
    paintingMat.hasAlpha = true;
    this.addComponent(paintingMat);
  }
}
