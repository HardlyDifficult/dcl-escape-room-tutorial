import { StateMachine } from "../modules/stateMachine";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";

/**
 * bubble floating around pushed by some wind from the fans
 */
export class MouseBubbleState extends StateMachine.State {
  mouseComponent: MouseComponent;
  bubbleBurstState: StateMachine.State;
  time: number;

  /**
   * create an instance of the state
   * @param mouseComponent mouse component
   * @param bubbleBurstState burst bubble state
   */
  constructor(
    mouseComponent: MouseComponent,
    bubbleBurstState: StateMachine.State
  ) {
    super();
    this.mouseComponent = mouseComponent;
    this.bubbleBurstState = bubbleBurstState;
  }
  /**
   * called when state starts
   */
  onStart() {
    this.time = 0.5;
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState(dt: number) {
    //increment time
    this.time += dt;
    //calc new position according to mouse direction, speed and time
    const newPosition = this.mouseComponent.transform.position.add(
      this.mouseComponent.direction.scale(0.2 * dt)
    );
    //let's use the SIN function to move the mouse a little up and down
    newPosition.y = 1.5 + Math.sin(this.time) * 0.1;
    //set new position to mouse
    this.mouseComponent.transform.position = newPosition;
    //check room boundries
    if (this.mouseComponent.transform.position.x < -1.12) {
      this.mouseComponent.transform.position.x = -1.12;
    } else if (this.mouseComponent.transform.position.x > 0.98) {
      this.mouseComponent.transform.position.x = 0.98;
    }
    if (this.mouseComponent.transform.position.z > 1.33) {
      this.mouseComponent.transform.position.z = 1.33;
    } else if (this.mouseComponent.transform.position.z < -1.37) {
      this.mouseComponent.transform.position.z = -1.37;
    }
    return true;
  }
  /**
   * handle events received by the state machine
   * @param event event to handle
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    //if bubble is clicked we burst it
    if (event instanceof StateMachineOnClickEvent) {
      event.stateMachine.setState(this.bubbleBurstState);
    }
    //if we trigger a collision
    else if (event instanceof StateMachineCollisionEvent) {
      //if it's a FAN, then we move in it's forward direction
      if (event.triggerType == StateMachineCollisionEvent.FANS) {
        const parentForward = Vector3.Forward().rotate(
          event.entity.getComponent(Transform).rotation
        );
        this.mouseComponent.direction = parentForward;
      }
      //if it's a PIKE then the bubble should burst
      else if (event.triggerType == StateMachineCollisionEvent.PIKES) {
        event.stateMachine.setState(this.bubbleBurstState);
      }
    }
  }
}
