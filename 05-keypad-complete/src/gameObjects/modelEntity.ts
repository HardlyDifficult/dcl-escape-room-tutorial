export class ModelEntity extends Entity {
  constructor(transform: TranformConstructorArgs, model: GLTFShape) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Adding Transform and Model
    this.addComponent(new Transform(transform));
    this.addComponent(model);
  }
}
