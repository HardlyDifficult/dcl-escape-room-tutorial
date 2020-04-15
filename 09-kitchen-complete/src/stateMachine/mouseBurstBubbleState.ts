import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * state for bubble bursting
 */
export class MouseBurstBubbleState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  audioClipPop: AudioClip;
  burstParticle: Entity;

  /**
   * create an instance of the state
   * @param mouseComponent mouse component
   * @param burstParticleSystem particle system to use when bubble burst
   */
  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
    this.audioClipPop = new AudioClip("sounds/pop.mp3");

    const bubbleParticleMaterial = new Material();
    bubbleParticleMaterial.albedoTexture = new Texture(
      "images/room9/bubbleParticle.png",
      { hasAlpha: true }
    );
    bubbleParticleMaterial.transparencyMode = 2;

    bubbleParticleMaterial.emissiveColor = Color3.White();

    this.burstParticle = new Entity();
    this.burstParticle.addComponent(new PlaneShape());
    this.burstParticle.addComponent(new Billboard());
    this.burstParticle.addComponent(bubbleParticleMaterial);
    this.burstParticle.addComponent(new Transform({ scale: Vector3.Zero() }));
    this.burstParticle.setParent(mouseComponent.mouseEntity.getParent());
  }
  /**
   * called when state starts
   */
  onStart() {
    //set the state as running
    this.isStateRunning = true;
    //scale down the bubble
    this.mouseComponent.bubble.addComponent(
      new utils.ScaleTransformComponent(
        new Vector3(0.5, 0.5, 0.5),
        Vector3.One(),
        0.5,
        (): void => {
          //the state shuld end now
          this.isStateRunning = false;
          //set bubble as invisible
          this.mouseComponent.bubble.getComponent(SphereShape).visible = false;
          //set particle position
          const particleTransform = this.burstParticle.getComponent(Transform);
          particleTransform.position = this.mouseComponent.transform.position;
          //play particle effect
          this.burstParticle.addComponent(
            new utils.ScaleTransformComponent(
              Vector3.Zero(),
              new Vector3(0.4, 0.4, 0.4),
              0.3,
              (): void => {
                particleTransform.scale = Vector3.Zero();
              }
            )
          );
          //play audioclip
          const audioSource = new AudioSource(this.audioClipPop);
          this.mouseComponent.mouseEntity.addComponentOrReplace(audioSource);
          audioSource.playOnce();
        }
      )
    );
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState() {
    //is state still running?
    return this.isStateRunning;
  }
}
