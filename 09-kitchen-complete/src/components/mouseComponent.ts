@Component("mouseComponent")
class MouseComponent {
  direction: Vector3;
  mouseEntity: Entity;
  transform: Transform;
  bubble: Entity = null;

  constructor(mouseEntity: Entity) {
    this.transform = mouseEntity.getComponent(Transform);
    this.mouseEntity = mouseEntity;
  }
}
