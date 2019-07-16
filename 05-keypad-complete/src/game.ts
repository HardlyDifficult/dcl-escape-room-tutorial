import { BaseScene } from "./gameObjects/baseScene";
import { CreateRoom5 } from "./scenes/room5";
import { TransformSystem } from "./modules/transfromSystem";

const transformSystem = new TransformSystem();
engine.addSystem(transformSystem);

const gameCanvas = new UICanvas();

new BaseScene();
CreateRoom5(gameCanvas);
