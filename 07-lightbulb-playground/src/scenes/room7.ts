import resources from "../resources";
import { Door, Button } from "../gameObjects/index";

const buttonPositions = [
  new Vector3(23.0891, 1.58507, 10.2526),
  new Vector3(23.0891, 1.48205, 11.2557),
  new Vector3(23.0891, 1.38123, 12.2855),
  new Vector3(23.0891, 1.52253, 13.2941)
];
const bulbPositions = [
  new Vector3(23.408, 2.26006, 10.3273),
  new Vector3(23.408, 2.22122, 11.1682),
  new Vector3(23.408, 2.10693, 12.1568),
  new Vector3(23.408, 2.24542, 13.1888)
];

export function CreateRoom7(): void {
  // This room has a door to get in
  const door = new Door(
    resources.models.door7,
    {
      position: new Vector3(26.3087, 0, 14.9449),
      rotation: Quaternion.Euler(0, -10.2, 0)
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

  // ToDo Create Room7
}
