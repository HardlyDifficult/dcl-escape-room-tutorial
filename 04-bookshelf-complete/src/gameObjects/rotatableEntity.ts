import utils from "../../node_modules/decentraland-ecs-utils/index";

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
    this.addComponent(new AudioSource(audio));
    this.addComponent(new Transform(transform));

    // Save the positions to move between
    const startRot = transform.rotation;
    const endRot = rotation;

    // Adding Toggle Component
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        // Rotating Entity
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              endRot,
              0.5
            )
          );
          // Playing Audio
          this.getComponent(AudioSource).playOnce();
        } else {
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              startRot,
              0.5
            )
          );
          // Playing Audio
          this.getComponent(AudioSource).playOnce();
        }
      })
    );
  }
}
