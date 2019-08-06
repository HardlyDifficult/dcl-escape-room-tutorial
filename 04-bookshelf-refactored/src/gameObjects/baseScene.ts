import resources from "../resources";

export class BaseScene extends Entity {
  constructor() {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.baseScene);
  }
}
