/**
 * A countdown timer which can be placed on a wall.
 */
export class CountdownTimeText extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(transform));
    this.addComponent(new TextShape());
    this.getComponent(TextShape).color = Color3.Red();  
  }

  // This method can be called anytime to change the number of seconds left on the clock
  public updateDisplay(seconds: number): void {
    this.getComponent(TextShape).value = this.formatTimeString(seconds);
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
}
