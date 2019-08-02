export class Button extends Entity {
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
