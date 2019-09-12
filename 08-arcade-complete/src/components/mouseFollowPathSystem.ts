import { MouseFollowPathComponent } from "./mouseFollowPathComponent";

export class MouseFollowPathSystem implements ISystem {
  update(dt: number): void {
    const mouseGroup = engine.getComponentGroup(MouseFollowPathComponent);
    for (const mouseEntity of mouseGroup.entities) {
      mouseEntity
        .getComponent(MouseFollowPathComponent)
        .update(dt, mouseEntity);
    }
  }
}
