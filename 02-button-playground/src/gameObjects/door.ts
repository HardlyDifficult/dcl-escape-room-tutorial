export class Door extends Entity {
  //variable to store if door is open
  private isDoorOpen: boolean = false;
  private doorAnimator: Animator = new Animator();

  constructor(transform: TranformConstructorArgs) {
    //create door entity
    super();

    //add gltf shape
    this.addComponent(new GLTFShape("models/generic/door.glb"));
  
    //add transform and set it in position
    this.addComponent(new Transform(transform));

    //create animator and add animation clips
    this.doorAnimator.addClip(new AnimationState("Open", { looping: false }));
    this.addComponent(this.doorAnimator);

    //create audio source component, set audio clip and add it to door entity
    this.addComponent(new AudioSource(new AudioClip("sounds/door_squeak.mp3")));

    //add door entity to engine
    engine.addEntity(this);
  }

  public openDoor(): void {
    if (!this.isDoorOpen) {
      this.isDoorOpen = true;
      this.doorAnimator.getClip("Open").play();
      this.getComponent(AudioSource).playOnce();
    }
  }
}
