import { Timer } from "../modules/timerSystem";

export class DoorTimer extends Timer {
  // Vairables to Store Text Entity
  private countdown: Entity;
  private countdownTextShape: TextShape;

  constructor(seconds: number, transform: TranformConstructorArgs) {
    // Create Timer
    super(seconds);

    // Creating Timer Entity
    this.countdown = new Entity();
    engine.addEntity(this.countdown);

    this.countdown.addComponent(new Transform(transform));

    // Creating Timer Text
    this.countdownTextShape = new TextShape(this.formatTimeString());
    this.countdownTextShape.color = Color3.Red();

    this.countdown.addComponent(this.countdownTextShape);
  }

  public updateDisplay(): void {
    this.countdownTextShape.value = this.formatTimeString();
  }

  private formatTimeString(): string {
    let mins = Math.floor(this.getTimeLeft() / 60);
    let secs = Math.floor(this.getTimeLeft() % 60);

    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  }
}
