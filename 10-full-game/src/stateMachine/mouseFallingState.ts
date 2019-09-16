import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { StateMachineCollisionEvent } from "./stateMachineCollisionEvent";
import { MouseComponent } from "../components/mouseComponent";

/**
 * state for mouse falling after bubble burst
 */
export class MouseFallingState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  deadState: StateMachine.State;

  /**
   * create instance of the state
   * @param mouseComponent mouse component
   * @param deadState state to start if mouse die
   */
  constructor(mouseComponent: MouseComponent, deadState: StateMachine.State) {
    super();
    this.mouseComponent = mouseComponent;
    this.deadState = deadState;
  }
  /**
   * called when state starts
   */
  onStart() {
    //set state as running
    this.isStateRunning = true;
    //move the mouse a little bit up with an ease out
    this.mouseComponent.mouseEntity.addComponent(
      new utils.MoveTransformComponent(
        this.mouseComponent.transform.position,
        this.mouseComponent.transform.position.add(new Vector3(0, 0.1, 0)),
        0.2,
        (): void => {
          //calc position to the floor
          const targetPosition = new Vector3(
            this.mouseComponent.transform.position.x,
            1,
            this.mouseComponent.transform.position.z
          );
          //move the mouse to the floor
          this.mouseComponent.mouseEntity.addComponent(
            new utils.MoveTransformComponent(
              this.mouseComponent.transform.position,
              targetPosition,
              0.5,
              (): void => {
                //state should end now
                this.isStateRunning = false;
              },
              utils.InterpolationType.EASEINQUAD
            )
          );
        },
        utils.InterpolationType.EASEOUTQUAD
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
  /**
   * handle events received by the state machine
   * @param event event to handle
   */
  onHandleEvent(event: StateMachine.IStateEvent) {
    //if we trigger a collision while falling down
    if (event instanceof StateMachineCollisionEvent) {
      //if we collide with a PIKE or with a BOX
      if (
        event.triggerType == StateMachineCollisionEvent.PIKES ||
        event.triggerType == StateMachineCollisionEvent.BOXES
      ) {
        //stop moving down
        if (
          this.mouseComponent.mouseEntity.hasComponent(
            utils.MoveTransformComponent
          )
        ) {
          this.mouseComponent.mouseEntity.removeComponent(
            utils.MoveTransformComponent
          );
        }
        //mouse should die
        event.stateMachine.setState(this.deadState);
      }
    }
  }
}
