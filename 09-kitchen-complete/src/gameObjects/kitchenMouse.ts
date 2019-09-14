import resources from "../resources";
import { MouseComponent } from "../components/mouseWillComponent";

export class KitchenMouse extends Entity {
  constructor(parent: Entity) {
    super("mouse");
    engine.addEntity(this);

    this.addComponent(resources.models.mouseWill);
    this.setParent(parent);

    this.addComponent(new Transform());
    this.addComponent(new MouseComponent(this));
  }
}
