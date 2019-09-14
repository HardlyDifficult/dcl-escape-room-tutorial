import utils from "../../node_modules/decentraland-ecs-utils/index";

export class KitchenTrigger extends Entity {
  constructor(size: Vector3, position: Vector3, layer: number, parent: Entity) {
    super();

    this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(size, position),
        layer
      )
    );
    this.setParent(parent);
  }
}
