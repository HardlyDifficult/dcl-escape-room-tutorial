import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Spotlight extends Entity {
  constructor(transform: TranformConstructorArgs, hiddenNumberValue: string) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(
      new AudioSource(resources.sounds.spotlight)
    );

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, value => {
        if (value == utils.ToggleState.On) {
          this.addComponent(resources.models.spotlight);

          const hiddenNumber = new Entity();
          hiddenNumber.addComponent(new TextShape());
          hiddenNumber.getComponent(TextShape).value = hiddenNumberValue;
          hiddenNumber.getComponent(TextShape).fontSize = 5;

          hiddenNumber.setParent(this);
          hiddenNumber.addComponent(
            new Transform({ position: new Vector3(0, 0.9, -0.4) })
          );

          this.getComponent(AudioSource).playOnce();
        }
      })
    );
  }
}
