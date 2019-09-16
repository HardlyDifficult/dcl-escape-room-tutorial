import { ToggleModelComponent } from "../components/toggleModelComponent";

export class ToggleEntity extends Entity {
  constructor(
    transform: TranformConstructorArgs,
    onModel: GLTFShape,
    offModel: GLTFShape
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(new ToggleModelComponent(this, onModel, offModel));
  }
}
