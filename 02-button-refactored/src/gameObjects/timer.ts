/**
 * A timer which can be placed on a wall.
 */
export class Timer extends Entity {
  // Store the text entity for use in the method below
  public timerText: Entity;

  constructor(model: GLTFShape, transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));

    this.timerText = new Entity();
    this.timerText.setParent(this);

    this.timerText.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.1),
        rotation: Quaternion.Euler(20, 180, 0)
      })
    );

    // The value to display will be controlled by the scene itself
    this.timerText.addComponent(new TextShape());
    this.timerText.getComponent(TextShape).color = Color3.Red();
    this.timerText.getComponent(TextShape).fontSize = 5;
  }

  private formatTimeString(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return (
      mins.toLocaleString(undefined, { minimumIntegerDigits: 2 }) +
      ":" +
      secs.toLocaleString(undefined, { minimumIntegerDigits: 2 })
    );
  }

  // This method can be called anytime to change the number of seconds on the clock
  public updateTimeString(seconds: number): void {
    this.timerText.getComponent(TextShape).value = this.formatTimeString(
      seconds
    );
  }
}
