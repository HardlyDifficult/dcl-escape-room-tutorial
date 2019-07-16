import resources from "../resources";

export class Painting extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new PlaneShape());
    this.addComponent(new Transform(transform));

    // Create a material for painting image
    let paintingMat = new Material();
    paintingMat.albedoTexture = resources.textures.fernPicture;
    paintingMat.hasAlpha = true;
    this.addComponent(paintingMat);
  }
}
