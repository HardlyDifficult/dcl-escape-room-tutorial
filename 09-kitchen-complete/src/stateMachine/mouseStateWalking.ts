import { StateMachine } from "../modules/stateMachine";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { StateMachineOnClickEvent } from "./stateMachineOnClickEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * mouse walking state
 */
export class MouseStateWalking extends StateMachine.State {
  mouseComponent: MouseComponent;
  deadState: StateMachine.State;
  cageState: StateMachine.State;

  /**
   * create an instance of the state
   * @param mouseComponent mouse component
   * @param deadState state for mouse dying
   * @param cageState state for going inside the cage
   */
  constructor(
    mouseComponent: MouseComponent,
    deadState: StateMachine.State,
    cageState: StateMachine.State
  ) {
    super();
    this.mouseComponent = mouseComponent;
    this.deadState = deadState;
    this.cageState = cageState;
  }
  /**
   * called when state starts
   */
  onStart() {
    //rotate mouse to look to direction
    this.mouseComponent.transform.lookAt(
      this.mouseComponent.transform.position.add(this.mouseComponent.direction)
    );
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState(dt: number) {
    //move mouse
    this.mouseComponent.transform.position = this.mouseComponent.transform.position.add(
      this.mouseComponent.direction.scale(0.5 * dt)
    );
    //check room boundries to make the mouse bounce and go the other direction
    if (this.mouseComponent.transform.position.x < -1.12) {
      this.mouseComponent.transform.position.x = -1.12;
      this.changeDirection();
    } else if (this.mouseComponent.transform.position.x > 0.98) {
      this.mouseComponent.transform.position.x = 0.98;
      this.changeDirection();
    }
    if (this.mouseComponent.transform.position.z > 1.33) {
      this.mouseComponent.transform.position.z = 1.33;
      this.changeDirection();
    } else if (this.mouseComponent.transform.position.z < -1.37) {
      this.mouseComponent.transform.position.z = -1.37;
      this.changeDirection();
    }
    return true;
  }
  /**
   * handle events received by the state machine
   * @param event event to handle
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    //if a collision is received
    if (event instanceof StateMachineCollisionEvent) {
      //if it's PIKES then mouse should die
      if (event.triggerType == StateMachineCollisionEvent.PIKES) {
        event.stateMachine.setState(this.deadState);
      }
      //it it's a BOX then mouse should change it moving direction
      else if (event.triggerType == StateMachineCollisionEvent.BOXES) {
        this.changeDirection();
      }
      //if it's the CAGE then we call the state to finish the puzzle
      else if (event.triggerType == StateMachineCollisionEvent.CAGE) {
        const mouseForward = Vector3.Forward().rotate(
          this.mouseComponent.transform.rotation
        );
        if (mouseForward.x >= 0.9) {
          event.stateMachine.setState(this.cageState);
        }
      }
    }
    //if mouse is clicked then bubble should appear
    else if (event instanceof StateMachineOnClickEvent) {
      event.stateMachine.setState(event.bubbleState);
    }
  }

  /**
   * change mouse moving direction and mouse rotation
   */
  private changeDirection() {
    this.mouseComponent.direction = this.mouseComponent.direction.scale(-1);
    this.mouseComponent.transform.lookAt(
      this.mouseComponent.transform.position.add(this.mouseComponent.direction)
    );
  }
}
