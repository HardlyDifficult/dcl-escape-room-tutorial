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

  public OpenDoor(playAudio: boolean): void {
    if (!this.isOpen) {
      this.animator.getClip("Door_Close").stop();
      this.animator.getClip("Door_Open").play();

      this.isOpen = true;
      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }
  public CloseDoor(playAudio: boolean): void {
    if (this.isOpen) {
      this.animator.getClip("Door_Open").stop();
      this.animator.getClip("Door_Close").play();

      this.isOpen = false;
      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }
  public ToggleDoor(playAudio: boolean): void {
    if (this.isOpen) {
      this.CloseDoor(playAudio);
    } else {
      this.OpenDoor(playAudio);
    }
  }
}
