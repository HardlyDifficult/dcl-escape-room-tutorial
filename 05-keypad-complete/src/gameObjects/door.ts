export class Door extends Entity {
  private doorAnimator: Animator = new Animator();

  isDoorOpen: boolean = false;

  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new GLTFShape("models/generic/door.glb"));
    this.addComponent(new Transform(transform));

    // Add the supported animations
    this.doorAnimator.addClip(new AnimationState("Open", { looping: false }));
    this.doorAnimator.addClip(new AnimationState("Close", { looping: false }));
    this.addComponent(this.doorAnimator);

    // Add an audio clip to play when opening / closing the door
    this.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));
  }

  public openDoor(): void {
    if (!this.isDoorOpen) {
      this.isDoorOpen = true;
      this.doorAnimator.getClip("Open").play();
      this.getComponent(AudioSource).playOnce();
    }
  }

  public closeDoor(): void {
    if (this.isDoorOpen) {
      this.isDoorOpen = false;
      this.doorAnimator.getClip("Close").play();
      this.getComponent(AudioSource).playOnce();
    }
  }
}
