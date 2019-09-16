import resources from "../resources";

export class NumPadLock extends Entity {
  constructor(model: GLTFShape) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
  }

  public playButtonPressed(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.button)
    );
    clip.playOnce();
  }

  public playAccessGranted(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.accessGranted)
    );
    clip.playOnce();
  }

  public playAccessDenied(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.accessDenied)
    );
    clip.playOnce();
  }
}
