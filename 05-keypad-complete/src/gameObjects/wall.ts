export class Wall extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new PlaneShape());
    this.addComponent(new Transform(transform));
  }
}
