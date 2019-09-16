import { StateMachine } from "../modules/stateMachine";
import utils from "../../node_modules/decentraland-ecs-utils/index";

/**
 * mouse appearing state
 */
export class MouseStateAppear extends StateMachine.State {
  mouseComponent: MouseComponent;

  constructor(mouseComponent: MouseComponent) {
    super();
    this.mouseComponent = mouseComponent;
  }

  /**
   * called when state starts
   */
  onStart() {
    //set mouse to it initial position
    this.mouseComponent.transform.position = new Vector3(
      -0.872083,
      1,
      -0.579439
    );
    //set mouse to it initial scale
    this.mouseComponent.transform.scale = Vector3.Zero();
    //set direction to zero
    this.mouseComponent.direction = Vector3.Zero();
    //start scaling mouse and set it direction when finish scaling
    this.mouseComponent.mouseEntity.addComponent(
      new utils.ScaleTransformComponent(
        Vector3.Zero(),
        Vector3.One(),
        1,
        (): void => {
          this.mouseComponent.direction = Vector3.Right();
          this.mouseComponent.transform.lookAt(
            this.mouseComponent.transform.position.add(
              this.mouseComponent.direction
            )
          );
        },
        utils.InterpolationType.EASEQUAD
      )
    );
  }
}
