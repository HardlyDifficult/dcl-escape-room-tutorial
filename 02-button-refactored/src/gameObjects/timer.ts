/**
 * A timer which can be placed on a wall.
 */
export class Timer extends Entity {
  // Store the text entity for use in the method below

  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));

    // The value to display will be controlled by the scene itself
    this.addComponent(new TextShape());
    this.getComponent(TextShape).color = Color3.Red();
    this.getComponent(TextShape).fontSize = 5;
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
    this.getComponent(TextShape).value = this.formatTimeString(
      seconds
    );
  }
}
