export class ToggleDoor extends Entity {
  private animator: Animator;
  private isOpen: boolean;

  constructor(
    transform: TranformConstructorArgs,
    model: GLTFShape,
    sound: AudioClip
  ) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Adding Transform and Model
    this.addComponent(new Transform(transform));
    this.addComponent(model);

    // Creating Animator
    this.animator = new Animator();
    this.animator.addClip(new AnimationState("Door_Open", { looping: false }));
    this.animator.addClip(new AnimationState("Door_Close", { looping: false }));

    // Adding Animator and Sound
    this.addComponent(this.animator);
    this.addComponent(new AudioSource(sound));
  }

  public OpenDoor(): void {
    if (!this.isOpen) {
      this.animator.getClip("Door_Close").stop();
      this.animator.getClip("Door_Open").play();

      this.getComponent(AudioSource).playOnce();
      this.isOpen = true;
    }
  }
  public CloseDoor(): void {
    if (this.isOpen) {
      this.animator.getClip("Door_Open").stop();
      this.animator.getClip("Door_Close").play();

      this.getComponent(AudioSource).playOnce();
      this.isOpen = false;
    }
  }
  public ToggleDoor(): void {
    if (this.isOpen) {
      this.CloseDoor();
    } else {
      this.OpenDoor();
    }
  }
}
