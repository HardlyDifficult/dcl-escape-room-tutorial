import { TransformSystem } from "./modules/transfromSystem";
import { CreateRoom4 } from "./scenes/room4";
import { TriggerSystem } from "./modules/triggerSystem";
import { BaseScene } from "./gameObjects/baseScene";

const transformSystem = new TransformSystem();
engine.addSystem(transformSystem);

const tiggerSytem = new TriggerSystem();
engine.addSystem(tiggerSytem);

new BaseScene();
CreateRoom4();