import resources from "../resources";

// Resources which are used multiple times below, to improve performance.
const audioAccessGranted = new AudioClip("sounds/access_granted.mp3");
const audioAccessDenied = new AudioClip("sounds/access_denied.mp3");

export class Keypad extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new GLTFShape("models/generic/codePad.glb"));
    this.addComponent(new Transform(transform));
  }

  public playButtonPressed(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(resources.buttonPressed)
    );
    clip.playOnce();
  }

  public playAccessGranted(): void {
    const clip = this.addComponentOrReplace(
      new AudioSource(audioAccessGranted)
    );
    clip.playOnce();
  }

  public playAccessDenied(): void {
    const clip = this.addComponentOrReplace(new AudioSource(audioAccessDenied));
    clip.playOnce();
  }
}
