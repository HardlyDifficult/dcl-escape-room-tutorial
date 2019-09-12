import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Spotlight extends Entity {
  constructor(transform: TranformConstructorArgs, hiddenNumberValue: string) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));

    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, value => {
        if (value == utils.ToggleState.On) {
          const spotLightLight = new Entity();
          this.addComponent(resources.models.spotlight);
          spotLightLight.setParent(this);

          const hiddenNumber = new Entity();
          const hiddenNumberShape = new TextShape();
          hiddenNumber.addComponent(hiddenNumberShape);
          hiddenNumber.addComponent(
            new Transform({ position: new Vector3(0, 0.9, -0.4) })
          );
          hiddenNumber.setParent(this);

          hiddenNumberShape.value = hiddenNumberValue;
          hiddenNumberShape.fontSize = 5;

          spotLightLight.addComponentOrReplace(
            new AudioSource(resources.sounds.spotlight)
          );
          spotLightLight.getComponent(AudioSource).playOnce();
        }
      })
    );
  }
}
