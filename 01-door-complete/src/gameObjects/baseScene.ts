export class BaseScene extends Entity {
  constructor() {
    super();
    this.addComponent(new GLTFShape("models/scene.glb"));
    this.addComponent(new Transform({ rotation: Quaternion.Euler(0, 180, 0) }));
    engine.addEntity(this);
  }
}