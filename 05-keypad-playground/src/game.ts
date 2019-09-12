import { CreateRoom5 } from "./scenes/room5";
import { BaseScene } from "./gameObjects/index";

// Add a canvas for UI elements
const gameCanvas = new UICanvas();

new BaseScene();
CreateRoom5(gameCanvas);
