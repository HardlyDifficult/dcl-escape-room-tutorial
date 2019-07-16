import resources from "../resources";

export class Keypad extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.codePad);
    this.addComponent(new Transform(transform));
  }

  public playButtonPressed(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.sounds.buttonPressed)
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
    const clip = this.addComponentOrReplace(new AudioSource(resources.sounds.accessDenied));
    clip.playOnce();
  }
}
