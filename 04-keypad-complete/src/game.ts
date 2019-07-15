import { CreateRoom4 } from "./scenes/room4";
import { CreateMainScene } from "./scenes/mainScene";
import { TransformSystem } from "./modules/transfromSystem";

const transformSystem = new TransformSystem();
engine.addSystem(transformSystem);
const gameCanvas = new UICanvas();
gameCanvas.visible = false;

CreateMainScene();
CreateRoom4(gameCanvas);
