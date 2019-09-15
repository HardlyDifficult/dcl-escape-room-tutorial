import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Mouse extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.mouse);
    this.addComponent(new Transform(transform));

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(new AnimationState("Mouse_Action"));

    this.getComponent(Animator)
      .getClip("Mouse_Action")
      .play();
    this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(
          new Vector3(0.05, 0.05, 0.05),
          Vector3.Zero()
        ),
        2,
        2
      )
    );
  }
}
