import { CreateMainScene } from "./scenes/mainScene";

/**
 * Load the game scene by scene.
 */
let baseScene = new Entity();
engine.addEntity(baseScene);

baseScene.addComponent(new GLTFShape("models/scene.glb"));
baseScene.addComponent(new Transform({ rotation: Quaternion.Euler(0, 180, 0) }));
