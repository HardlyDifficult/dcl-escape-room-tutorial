import utils from "../../node_modules/decentraland-ecs-utils/index";

export class MovableEntity extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    sound: AudioClip,
    deltaPosition: Vector3
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));
    this.addComponent(new AudioSource(sound));

    const startPos = transform.position;
    const endPos = transform.position.add(deltaPosition);

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        if (value == utils.ToggleState.On) {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              endPos,
              0.5
            )
          );
        } else {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              startPos,
              0.5
            )
          );
        }

        this.getComponent(AudioSource).playOnce();
      })
    );
  }
}
