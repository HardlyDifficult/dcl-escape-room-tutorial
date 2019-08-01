// Create an entity for the main scene model
const baseScene = new Entity();

// Add it to the engine for rendering
engine.addEntity(baseScene);

// Give it a component for the model itself
baseScene.addComponent(new GLTFShape("models/scene.glb"));