import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export class Fan extends Entity {
  constructor(
    transform: TranformConstructorArgs,
    parent: Entity,
    fanLayer: number
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(resources.models.fanModel);

    this.addComponent(new Animator());
    this.getComponent(Animator).addClip(
      new AnimationState("Fan_Action", { looping: true })
    );

    this.addComponent(new AudioSource(resources.sounds.fanAudio));
    this.setParent(parent);

    // Calculating Trigger Size
    const triggerSize = new Vector3(0.5, 0.5, 2.25).rotate(transform.rotation);
    triggerSize.x = Math.abs(triggerSize.x);
    triggerSize.y = Math.abs(triggerSize.y);
    triggerSize.z = Math.abs(triggerSize.z);
    const triggerPosition = new Vector3(0.2, 0.65, 1.35).rotate(
      transform.rotation
    );

    // Creating Trigger Component
    const triggerComponent = new utils.TriggerComponent(
      new utils.TriggerBoxShape(triggerSize, triggerPosition),
      fanLayer
    );
    triggerComponent.enabled = false;
    this.addComponent(triggerComponent);

    // Adding Toggle Component
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        if (value == utils.ToggleState.On) {
          this.getComponent(Animator)
            .getClip("Fan_Action")
            .play();
          this.getComponent(AudioSource).playing = true;
          this.getComponent(AudioSource).loop = true;
          this.getComponent(AudioSource).volume = 0.3;
          triggerComponent.enabled = true;
        } else {
          this.getComponent(AudioSource).playing = false;
          this.getComponent(Animator)
            .getClip("Fan_Action")
            .stop();
          triggerComponent.enabled = false;
        }
      })
    );

    // Adding OnClick Event
    this.addComponent(
      new OnClick((): void => {
        this.getComponent(utils.ToggleComponent).toggle();
      })
    );
  }
}
