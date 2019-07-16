import resources from "../resources";

export class Coin extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.coin);
    this.addComponent(new Transform(transform));
  }
}
