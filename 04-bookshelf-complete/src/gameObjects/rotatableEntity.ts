import utils from "../../node_modules/decentraland-ecs-utils/index";

/**
 * An object which rotates back and forth when toggled.
 */
export class RotatableEntity extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    audio: AudioClip,
    rotation: Quaternion
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));
    this.addComponent(new AudioSource(audio));

    // Save the positions to move between
    const startRot = transform.rotation;
    const endRot = rotation;

    // Add a Toggle component which defaults to Off
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        if (value == utils.ToggleState.On) {
          // Rotate to the endRot when toggled on
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              endRot,
              0.5
            )
          );
        } else {
          // Rotate to the startRot when toggled on
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              startRot,
              0.5
            )
          );
        }

        // Play the sound effect
        this.getComponent(AudioSource).playOnce();
      })
    );
  }
}
