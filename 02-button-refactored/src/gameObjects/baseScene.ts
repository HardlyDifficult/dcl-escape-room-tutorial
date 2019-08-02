/**
 * The base scene model
 */

/**
 * Export the class to be used by another file
 * Extends a basic `Entity` so additional components may be added go GameObjects when needed
 */ 
export class BaseScene extends Entity {
  // The constructor is required for the class, called when `new BaseScene()` is used
  constructor() {
    // First call the Entity constructor
    super();
    // Then add this object to the engine for rendering
    engine.addEntity(this);

    // Add components which always apply to this GameObject
    this.addComponent(new GLTFShape("models/scene.glb"));
  }
}
