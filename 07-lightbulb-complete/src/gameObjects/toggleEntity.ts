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

  IsLightOn(): boolean {
    return this.getComponent(utils.ToggleComponent).isOn();
  }

  Toggle(): void {
    this.getComponent(utils.ToggleComponent).toggle();
  }
  SetOn(): void {
    this.getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  }
  setOff(): void {
    this.getComponent(utils.ToggleComponent).set(utils.ToggleState.Off);
  }
}
