import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Trigger extends Entity {
  private value: boolean;

  constructor(
    position: Vector3,
    scale: Vector3,
    onEnter?: () => void,
    onExit?: () => void
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(scale, position),
        0,
        0,
        null,
        null,
        onEnter,
        onExit
      )
    );
  }
}
