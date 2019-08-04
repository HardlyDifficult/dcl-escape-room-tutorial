export class EmptyEntity extends Entity {
  private shape: BoxShape;

  constructor(transform: TranformConstructorArgs, onClick: OnClick) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Adding Box
    this.shape = new BoxShape();
    this.shape.visible = false;

    // Adding Transform and Invisible Shape
    this.addComponent(new Transform(transform));
    this.addComponent(this.shape);

    this.addComponent(onClick);
  }
}
