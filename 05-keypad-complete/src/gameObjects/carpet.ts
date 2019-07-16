import { ToggleComponent } from "../modules/toggleComponent";
import { RotateTransformComponent } from "../modules/transfromSystem";
import resources from "../resources";

export class Carpet extends Entity {
  constructor(transform: TranformConstructorArgs) {
    super();
    engine.addEntity(this);

    this.addComponent(resources.models.carpet);
    this.addComponent(new Transform(transform));

    // Add a toggle component to rotate the carpet back and forth
    this.addComponent(
      new ToggleComponent(ToggleComponent.State.Off, (value): void => {
        if (value == ToggleComponent.State.On) {
          this.addComponentOrReplace(
            new RotateTransformComponent(
              this.getComponent(Transform).rotation,
              Quaternion.Euler(0, 45, 0),
              0.7
            )
          );
        } else {
          this.addComponentOrReplace(
            new RotateTransformComponent(
              this.getComponent(Transform).rotation,
              Quaternion.Euler(0, 0, 0),
              0.7
            )
          );
        }
      })
    );
  }

  public rotateCarpet(): void {
    this.getComponent(ToggleComponent).toggle();
  }
}
