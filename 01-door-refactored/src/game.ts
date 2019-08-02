import { CreateRoom1 } from "./scenes/room1";

const baseScene = new Entity();
engine.addEntity(baseScene);
baseScene.addComponent(new GLTFShape("models/scene.glb"));

CreateRoom1();
