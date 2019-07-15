import { CreateRoom5 } from "./scenes/room5";
import { CreateMainScene } from "./scenes/mainScene";
import { TransformSystem } from "./modules/transfromSystem";

const transformSystem = new TransformSystem();
engine.addSystem(transformSystem);

const gameCanvas = new UICanvas();

CreateMainScene();
CreateRoom5(gameCanvas);
