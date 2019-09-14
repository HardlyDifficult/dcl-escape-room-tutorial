export class AnimatedModel extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    animation: AnimationState
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(model);

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(animation);
  }
}
