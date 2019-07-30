// Export as a function for game.ts to call in order to construct the base scene
export function CreateBaseScene(): void {
  const baseScene = new Entity();
  engine.addEntity(baseScene);

  baseScene.addComponent(new GLTFShape("models/scene.glb"));
}
