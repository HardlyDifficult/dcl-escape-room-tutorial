export class Door extends Entity {
  public isOpen: boolean;

  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    sound: AudioClip
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Door_Open", { looping: false })
    );
    this.getComponent(Animator).addClip(
      new AnimationState("Door_Close", { looping: false })
    );

    this.addComponent(new AudioSource(sound));
  }

  public openDoor(playAudio = true): void {
    if (!this.isOpen) {
      this.isOpen = true;

      this.getComponent(Animator)
        .getClip("Door_Close")
        .stop(); // bug workaround
      this.getComponent(Animator)
        .getClip("Door_Open")
        .play();

      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }

  public closeDoor(playAudio = true): void {
    if (this.isOpen) {
      this.isOpen = false;

      this.getComponent(Animator)
        .getClip("Door_Open")
        .stop(); // bug workaround
      this.getComponent(Animator)
        .getClip("Door_Close")
        .play();

      if (playAudio) {
        this.getComponent(AudioSource).playOnce();
      }
    }
  }

  public toggleDoor(playAudio = true): void {
    if (this.isOpen) {
      this.closeDoor(playAudio);
    } else {
      this.openDoor(playAudio);
    }
  }
}
