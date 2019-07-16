import resources from "../resources";

export class BaseScene extends Entity {
  constructor() {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.scene);
    this.addComponent(new Transform({ rotation: Quaternion.Euler(0, 180, 0) }));
  }
}
