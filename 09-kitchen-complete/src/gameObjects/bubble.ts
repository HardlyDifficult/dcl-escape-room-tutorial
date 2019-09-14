import resources from "../resources";

export class Bubble extends Entity {
  constructor(tranform: TranformConstructorArgs, parent: Entity) {
    super();
    engine.addEntity(this);

    this.addComponent(new Transform(tranform));
    this.addComponent(new SphereShape());

    this.getComponent(SphereShape).visible = false;

    const bubbleMaterial = new Material();
    bubbleMaterial.albedoTexture = resources.textures.bubble;
    bubbleMaterial.hasAlpha = true;
    bubbleMaterial.alpha = 0.5;

    this.addComponent(bubbleMaterial);
    this.setParent(parent);
  }
}
