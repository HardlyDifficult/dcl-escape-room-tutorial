export class Button extends Entity {
  private animator: Animator;

  constructor(transform: TranformConstructorArgs) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Adding Transform
    this.addComponent(new Transform(transform));

    // Adding Model and Sound
    this.addComponent(new GLTFShape("models/generic/Round_Button.glb"));
    this.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));

    // Adding Animator
    this.animator = new Animator();
    this.animator.addClip(
      new AnimationState("Button_Action", { looping: false })
    );

    this.addComponent(this.animator);
  }

  public Pressed(): void {
    this.animator.getClip("Button_Action").play();
    this.getComponent(AudioSource).playOnce();
  }
}
