import { TransformSystem } from "./modules/transfromSystem";
import { CreateRoom4 } from "./scenes/room4";
import { BaseScene } from "./gameObjects/baseScene";

const transformSystem = new TransformSystem();
engine.addSystem(transformSystem);

new BaseScene();
CreateRoom4();
