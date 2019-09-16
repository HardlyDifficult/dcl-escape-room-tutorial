import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * state for bubble appearing and then going up in the air
 */
export class MouseBubbleStartState extends StateMachine.State {
  mouseComponent: MouseComponent;
  bubbleState: StateMachine.State;
  isUp: boolean;
  audioClipInflate: AudioClip;

  /**
   * create instance of the state
   * @param mouseComponent mouse component
   * @param bubbleState state for mouse inside bubble floating in place
   */
  constructor(mouseComponent: MouseComponent, bubbleState: StateMachine.State) {
    super();
    this.mouseComponent = mouseComponent;
    this.bubbleState = bubbleState;
    this.audioClipInflate = new AudioClip("sounds/inflator.mp3");
  }
  /**
   * called when state starts
   */
  onStart() {
    //mouse is not fully up in the air yet
    this.isUp = false;
    //let's make the bubble appear
    this.mouseComponent.bubble.getComponent(SphereShape).visible = true;
    //scale the bubble to it's default scale
    this.mouseComponent.bubble.addComponent(
      new utils.ScaleTransformComponent(
        Vector3.Zero(),
        new Vector3(0.3, 0.3, 0.3),
        1.5,
        (): void => {
          //when bubble finish scaling up, whe move the mouse up in the air
          const currentPosition = this.mouseComponent.transform.position;
          const targetPosition = new Vector3(
            currentPosition.x,
            1.4,
            currentPosition.z
          );
          this.mouseComponent.mouseEntity.addComponent(
            new utils.MoveTransformComponent(
              currentPosition,
              targetPosition,
              1,
              (): void => {
                //now mouse is fully up in the air
                this.isUp = true;
              }
            )
          );
        }
      )
    );
    //play sound
    const audioSource = new AudioSource(this.audioClipInflate);
    this.mouseComponent.mouseEntity.addComponentOrReplace(audioSource);
    audioSource.playOnce();
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState(dt: number) {
    return true;
  }
  /**
   * handle events received by the state machine
   * @param event event to handle
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    //if bubble is clicked
    if (event instanceof StateMachineOnClickEvent) {
      //and we are fully up in the air
      if (this.isUp) {
        //we burst the bubblw
        event.stateMachine.setState(event.burstState);
      }
    }
    //if we receive a collision event
    else if (event instanceof StateMachineCollisionEvent) {
      //and the collision is with a trigger of a fan
      if (event.triggerType == StateMachineCollisionEvent.FANS) {
        //get the forward vector of the fan and set it as mouse's direction
        const parentForward = Vector3.Forward().rotate(
          event.entity.getComponent(Transform).rotation
        );
        this.mouseComponent.direction = parentForward;
        //and change the state to the bubble floating around state
        event.stateMachine.setState(this.bubbleState);
      }
    }
  }
}
