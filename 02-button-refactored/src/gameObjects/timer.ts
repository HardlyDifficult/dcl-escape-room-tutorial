import { TriggerSphereShape } from "../../node_modules/decentraland-ecs-utils/triggers/triggerSystem";

export class Timer extends Entity {
  private countDownText: Entity;
  private timerText: TextShape;

  public openDoorTime = 5; // In Seconds

  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(new GLTFShape("models/room1/Countdown_Clock.glb"));

    this.countDownText = new Entity();
    this.countDownText.setParent(this);

    this.countDownText.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.1),
        rotation: Quaternion.Euler(20, 180, 0)
      })
    );

    this.timerText = new TextShape(this.formatTimeString(this.openDoorTime));
    this.timerText.color = Color3.Red();
    this.timerText.fontSize = 5;

    this.countDownText.addComponent(this.timerText);
  }

  // Function to convert the time left into a string like "00:05"
  private formatTimeString(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  }

  public updateTimeString(seconds: number): void {
    this.timerText.value = this.formatTimeString(seconds);
  }
}
