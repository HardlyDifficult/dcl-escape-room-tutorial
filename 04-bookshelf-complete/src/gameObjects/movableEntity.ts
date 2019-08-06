import utils from "../../node_modules/decentraland-ecs-utils/index";

export class MovableEntity extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    sound: AudioClip,
    deltaPosition: Vector3,
    // Add a variable move time with a default value
    moveTime: number = 0.5 
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
              moveTime
            )
          );
        } else {
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              startPos,
              moveTime
            )
          );
        }

        this.getComponent(AudioSource).playOnce();
      })
    );
  }
}
