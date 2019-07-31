/**
 * A big red button.
 */
export class Button extends Entity {
  // Add transform as a parameter so that scene file can be responsible for positioning
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new GLTFShape("models/generic/redbutton.gltf"));
    this.addComponent(new Transform(transform));

    this.addComponent(new AudioSource(new AudioClip("sounds/button.mp3")));
  }

  // A button can be pressed.  At the moment this just plays a sound effect
  // but maybe an animation will be added in the future as well.
  public pressButton(): void {
    this.getComponent(AudioSource).playOnce();
  }
}
