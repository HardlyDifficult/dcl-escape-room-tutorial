import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Door, Ticket, Mouse, ArcadeScreen } from "../gameObjects/index";

export function CreateRoom8(): void {
  const door = new Door(
    resources.models.door8,
    {
      position: new Vector3(22.612, 0, 14.9205),
      rotation: Quaternion.Euler(0, 135, 0)
    },
    resources.sounds.doorSqueek
  );
  door.addComponent(
    new OnClick((): void => {
      door.openDoor();
    })
  );

  // The ticket will reveal the hint for this room
  const ticket = new Ticket({
    position: new Vector3(18.1903, 0.397274, 11.771),
    rotation: Quaternion.Euler(0, 63.6, 0)
  });

  // Adding Arcade Screen
  const columnCount = 5;
  const rowCount = 5;

  const arcade = new ArcadeScreen(
    new Vector3(0.3, 0.3, 1),
    columnCount,
    rowCount,
    new Vector3(0.09, 0.05, 0),
    new Vector3(17.7913, 0.871266, 10.6956),
    Quaternion.Euler(118, -45, 127.3)
  );

  // Adding Mice to run across the screen
  const mouse1 = new Mouse({
    position: new Vector3(25.82, 1.46, 4.25),
    scale: new Vector3(0.8, 0.8, 0.8)
  });
  const mouse2 = new Mouse({
    position: new Vector3(26.54, 0.85, 3.9),
    scale: new Vector3(0.8, 0.8, 0.8)
  });

  // TODO get the mice running across the screen

  // When the player wins the game
  arcade.onCompletion = () => {
    // Reveal the hint
    ticket.emitTicket();
  };
}
