import utils from "../../node_modules/decentraland-ecs-utils/index";

@Component("mouseFollowPathComponent")
export class MouseFollowPathComponent {
  private startDelay: number;
  private idleTime: number;
  private path: Vector3[];
  private movingTime: number;
  private onIdleChanged: () => boolean;

  private reversePath: boolean;
  private currentTime: number;
  private isInIdleTime: boolean;

  constructor(
    startDelay: number,
    idleTime: number,
    path: Vector3[],
    movingTime: number,
    onIdleChanged: () => boolean
  ) {
    this.startDelay = startDelay;
    this.idleTime = idleTime;
    this.path = path;
    this.movingTime = movingTime;
    this.onIdleChanged = onIdleChanged;

    this.reversePath = false;
    this.currentTime = idleTime;
    this.isInIdleTime = true;
  }

  update(dt: number, mouseEntiy: IEntity) {
    //check if waiting for start
    if (this.startDelay > 0) {
      this.startDelay -= dt;
    }
    //when mouse is idle
    else if (this.isInIdleTime) {
      //increase time in idle state
      this.currentTime += dt;
      //when idle time is reached and can change idle state
      if (this.currentTime >= this.idleTime && this.onIdleChanged()) {
        //we are not in idle state any more
        this.isInIdleTime = false;

        let path: Vector3[];
        //check if we shoul reverse the path
        if (this.reversePath) {
          path = this.path.reverse();
        } else {
          path = this.path;
        }
        //rotate mouse to look at it's next point in path
        mouseEntiy.getComponent(Transform).lookAt(path[1]);
        //add component to follow the path
        mouseEntiy.addComponentOrReplace(
          new utils.FollowPathComponent(
            path,
            this.movingTime,
            () => {
              //when path is finished we reset mouse variables
              this.isInIdleTime = true;
              this.currentTime = 0;
              //we set the mouse to go the other way arround next time
              this.reversePath = true;
              //callback that idle state is going to change
              this.onIdleChanged();
            },
            (currentPoint, nextPoint) => {
              //when we reach a new point in path we rotate the mouse to look at the next point
              mouseEntiy.getComponent(Transform).lookAt(nextPoint);
            }
          )
        );
      }
    }
  }
}
