import { CreateRoom4 } from "./scenes/room4";
import { CreateMainScene } from "./scenes/mainScene";

const gameCanvas = new UICanvas();
gameCanvas.visible = false;

CreateMainScene();
CreateRoom4(gameCanvas);