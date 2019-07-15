export class Coin extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new GLTFShape("models/room4/coin.glb"));
    this.addComponent(new Transform(transform));
  }
}
