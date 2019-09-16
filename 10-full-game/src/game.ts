import { BaseScene } from "./gameObjects/index";
import { CreateRoom1 } from "./scenes/room1";
import { CreateRoom2 } from "./scenes/room2";
import { CreateRoom3 } from "./scenes/room3";
import { CreateRoom4 } from "./scenes/room4";
import { CreateRoom5 } from "./scenes/room5";
import { CreateRoom6 } from "./scenes/room6";
import { CreateRoom7 } from "./scenes/room7";
import { CreateRoom8 } from "./scenes/room8";
import { CreateRoom9 } from "./scenes/room9";

new BaseScene();
const gameCanvas = new UICanvas();

CreateRoom1();
CreateRoom2();
CreateRoom3();
CreateRoom4();
CreateRoom5(gameCanvas);
CreateRoom6(gameCanvas);
CreateRoom7();
CreateRoom8();
CreateRoom9();
