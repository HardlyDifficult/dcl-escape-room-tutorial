import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { MouseComponent } from "../components/mouseComponent";

/**
 * state to make mouse enter the cage
 */
export class MouseEnterCageState extends StateMachine.State {
  mouseComponent: MouseComponent;
  isStateRunning: boolean;
  onStateFinish: () => void;

  /**
   * create instance of the state
   * @param mouseComponent mouse component
   * @param onStateFinish callback when state ends
   */
  constructor(mouseComponent: MouseComponent, onStateFinish: () => void) {
    super();
    this.mouseComponent = mouseComponent;
    this.onStateFinish = onStateFinish;
  }
  /**
   * called when state starts
   */
  onStart() {
    //the state is running
    this.isStateRunning = true;
    //let's move the mouse inside the cage
    this.mouseComponent.mouseEntity.addComponent(
      new utils.MoveTransformComponent(
        this.mouseComponent.transform.position,
        new Vector3(1.85275, 1.06965, -0.04),
        1.5,
        (): void => {
          //state should end now
          this.isStateRunning = false;
        },
        utils.InterpolationType.EASEQUAD
      )
    );
  }
  /**
   * called when state is updated
   * @param dt delta
   * return TRUE to keep state running, FALSE to finish state
   */
  onUpdateState() {
    return this.isStateRunning;
  }
  onEnd() {
    //callback call
    if (this.onStateFinish) this.onStateFinish();
  }
}
