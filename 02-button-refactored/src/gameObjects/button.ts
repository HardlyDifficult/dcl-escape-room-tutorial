/**
 * A big red button.
 */
export class Button extends Entity {
  // The shape and position may differ
  constructor(model: GLTFShape, transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));

    this.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Button_Action", { looping: false })
    );
  }

  /**
   * A button can be pressed.  At the moment this just plays a sound effect
   * but maybe an animation will be added in the future as well.
   */
  public press(): void {
    this.getComponent(Animator)
      .getClip("Button_Action")
      .stop(); // bug workaround
    this.getComponent(Animator)
      .getClip("Button_Action")
      .play();
    this.getComponent(AudioSource).playOnce();
  }
}
