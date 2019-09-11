import { Door, Ticket, Mouse, ArcadeScreen } from "../gameObjects/index";
import resources from "../resources";
import { MouseFollowPathComponent } from "../components/mouseFollowPathComponent";
import { MouseFollowPathSystem } from "../components/mouseFollowPathSystem";

export function CreateRoom8(): void {
  // Adding Arcade Ticket
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

  // Adding Mice
  const mouse1 = new Mouse({
    position: new Vector3(25.82, 1.46, 4.25),
    scale: new Vector3(0.8, 0.8, 0.8)
  });
  const mouse2 = new Mouse({
    position: new Vector3(26.54, 0.85, 3.9),
    scale: new Vector3(0.8, 0.8, 0.8)
  });

  // Adding Mouse Behaviour System to Engine
  const mouseBehaviorSystem = new MouseFollowPathSystem();
  engine.addSystem(mouseBehaviorSystem);

  const onMouseIdleChanged = (): boolean => {
    if (arcade.tilesPaintedByPlayer == columnCount * rowCount) {
      // Removing Components
      mouse1.removeComponent(MouseFollowPathComponent);
      mouse2.removeComponent(MouseFollowPathComponent);
      engine.removeSystem(mouseBehaviorSystem);

      ticket.AnimateTicket();
      return false;
    }
    return true;
  };

  // Creating Mouse Follow Components
  mouse1.addComponent(
    new MouseFollowPathComponent(
      7.5,
      7,
      [
        new Vector3(17.37, 1.69, 10.06),
        new Vector3(16.7, 1.7, 11.47),
        new Vector3(16.3, 2.24, 11.28)
      ],
      2,
      onMouseIdleChanged
    )
  );
  mouse2.addComponent(
    new MouseFollowPathComponent(
      0,
      6,
      [
        new Vector3(17.49, 0.6, 11.85),
        new Vector3(16.7, 1.7, 11.47),
        new Vector3(16.36, 1.7, 12.17)
      ],
      5,
      onMouseIdleChanged
    )
  );

  // Adding Door
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
      if (!door.isOpen) {
        door.openDoor();
      }
    })
  );
}
