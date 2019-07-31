export function CreateBaseScene(): void {
  const baseScene = new Entity();
  engine.addEntity(baseScene);

  baseScene.addComponent(new GLTFShape("models/scene.glb"));
}
