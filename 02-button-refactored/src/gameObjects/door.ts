export class Door extends Entity {
  //variable to store if door is open
  private isDoorOpen: boolean = false;
  private doorAnimator: Animator = new Animator();

  constructor(transform: TranformConstructorArgs) {
    //create door entity
    super();
    //add door entity to engine
    engine.addEntity(this);

    //add gltf shape
    this.addComponent(new GLTFShape("models/generic/door.glb"));

    //add transform and set it in position
    this.addComponent(new Transform(transform));

    //create animator and add animation clips
    this.doorAnimator.addClip(new AnimationState("Open", { looping: false }));
    this.doorAnimator.addClip(new AnimationState("Close", { looping: false }));
    this.addComponent(this.doorAnimator);

    //create audio source component, set audio clip and add it to door entity
    this.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

  }
  public openDoor(): void {
    if (!this.isDoorOpen) {
      this.isDoorOpen = true;
      this.doorAnimator.getClip("Close").stop();
      this.doorAnimator.getClip("Open").play();
      this.getComponent(AudioSource).playOnce();
    }
  }
  public closeDoor(): void {
    if (this.isDoorOpen) {
      this.isDoorOpen = false;
      this.doorAnimator.getClip("Open").stop();
      this.doorAnimator.getClip("Close").play();
      this.getComponent(AudioSource).playOnce();
    }
  }
}
