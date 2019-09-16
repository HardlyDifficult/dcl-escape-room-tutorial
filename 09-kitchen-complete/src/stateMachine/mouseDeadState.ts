import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";

/**
 * state for when mouse dies
 */
export class MouseDeadState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }
  /**
   * called when state starts
   */
  onStart() {
    //state is running
    this.isStateRunning = true;
    //set time for the transfom system's components
    const time = 1.5;
    //rotate the mouse
    this.mouseComponent.mouseEntity.addComponent(
      new utils.RotateTransformComponent(
        this.mouseComponent.transform.rotation,
        this.mouseComponent.transform.rotation.multiply(
          Quaternion.Euler(0, 270, 0)
        ),
        time
      )
    );
    //and scale it down
    this.mouseComponent.mouseEntity.addComponent(
      new utils.ScaleTransformComponent(
        this.mouseComponent.transform.scale,
        Vector3.Zero(),
        time,
        (): void => {
          //now the state should end
          this.isStateRunning = false;
        },
        utils.InterpolationType.EASEINQUAD
      )
    );
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState() {
    //is state running?
    return this.isStateRunning;
  }
}
