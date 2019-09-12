export class Model extends Entity {
  constructor(model: GLTFShape, transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(model);
  }
}
