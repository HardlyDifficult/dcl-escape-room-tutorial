import { ToggleModelComponent } from "../components/toggleModelComponent";
import utils from "../../node_modules/decentraland-ecs-utils/index";

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

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        if (value === utils.ToggleState.On) {
          this.getComponent(ToggleModelComponent).SetOn();
        } else {
          this.getComponent(ToggleModelComponent).SetOff();
        }
      })
    );
  }
}
