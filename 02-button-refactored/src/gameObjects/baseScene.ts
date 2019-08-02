export class BaseScene extends Entity {
  constructor() {
    super();
    engine.addEntity(this);
    this.addComponent(new GLTFShape("models/scene.glb"));
  }
}
