/**
 * A door and its basic behaviors to be reused by every room.
 */
export class Door extends Entity {
  isDoorOpen: boolean = false;

  // Pass the model src since each door has a unique look
  constructor(modelSrc: string, transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new GLTFShape(modelSrc));
    this.addComponent(new Transform(transform));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Open", { looping: false })
    );
    this.getComponent(Animator).addClip(
      new AnimationState("Close", { looping: false })
    );

    this.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));
  }

  // Exposing `openDoor` as an action this object is capable of
  // This contains the open door experience (animation and sound) while allowing
  // the scenes to decide when the action occurs (e.g. on door click in room 1 or button click in room 2)
  public openDoor(): void {
    if (!this.isDoorOpen) {
      this.isDoorOpen = true;
      this.getComponent(Animator)
        .getClip("Close")
        .stop();
      this.getComponent(Animator)
        .getClip("Open")
        .play();
      this.getComponent(AudioSource).playOnce();
    }
  }

  // Similiarly we can close the door.
  public closeDoor(): void {
    if (this.isDoorOpen) {
      this.isDoorOpen = false;
      this.getComponent(Animator)
        .getClip("Open")
        .stop();
      this.getComponent(Animator)
        .getClip("Close")
        .play();
      this.getComponent(AudioSource).playOnce();
    }
  }
}
