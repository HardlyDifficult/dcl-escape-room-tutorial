export class GenericModel extends Entity {
  constructor(model: GLTFShape, transform: TranformConstructorArgs) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Adding Components
    this.addComponent(new Transform(transform));
    this.addComponent(model);
  }
}
