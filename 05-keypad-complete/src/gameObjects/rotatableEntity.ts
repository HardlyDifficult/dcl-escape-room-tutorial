import utils from "../../node_modules/decentraland-ecs-utils/index";

export class RotatableEntity extends Entity {
  private startRot: Quaternion;
  private endRot: Quaternion;

  constructor(transform: TranformConstructorArgs, rotation: Quaternion) {
    // Creating Entity
    super();
    engine.addEntity(this);

    // Creating Transform
    this.addComponent(new Transform(transform));

    // Setting Rotational Vectors
    this.startRot = transform.rotation;
    this.endRot = rotation;

    // Adding Toggle Component
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        // Rotating Entity
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              this.endRot,
              0.5
            )
          );
          // Playing Audio
          this.getComponent(AudioSource).playOnce();
        } else {
          this.addComponentOrReplace(
            new utils.RotateTransformComponent(
              this.getComponent(Transform).rotation,
              this.startRot,
              0.5
            )
          );
          // Playing Audio
          this.getComponent(AudioSource).playOnce();
        }
      })
    );

    // Adding OnClick Event
    this.addComponent(
      new OnClick((): void => {
        this.getComponent(utils.ToggleComponent).toggle();
      })
    );
  }
}
