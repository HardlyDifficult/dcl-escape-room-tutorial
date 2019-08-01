import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import { HintImage } from "../ui/hintImage";
import { ModelEntity } from "../gameObjects/modelEntity";
import { RotatableEntity } from "../gameObjects/rotatableEntity";
import { ToggleDoor } from "../gameObjects/toggleDoor";
import { EmptyEntity } from "../gameObjects/emptyEntity";
import { Keypad } from "../ui/keypad";

export function CreateRoom5(gameCanvas: UICanvas): void {
  // Creating Door
  const door = new ToggleDoor(
    new Transform({
      position: new Vector3(19.5141, 5.54709, 25.676)
    }),
    resources.models.door5,
    resources.sounds.doorSqueak
  );

  // Creating Keypad
  const keypad = new Keypad(gameCanvas, door);

  // Creating Keypad Lock
  const keypadLock = new EmptyEntity(
    new Transform({
      position: new Vector3(19.6486, 7, 23.142),
      scale: new Vector3(0.2, 0.6, 0.4)
    }),
    keypad
  );

  // Creating Painting
  const painting = new ModelEntity(
    new Transform({
      position: new Vector3(22.2283, 7.60325, 20.9326)
    }),
    resources.models.pictureFrame
  );

  // Creating Painting Hint
  const paintingHint = new HintImage(gameCanvas, resources.textures.fernHint);

  // Adding OnClick Event
  painting.addComponent(
    new OnClick((): void => {
      paintingHint.visible = true;
    })
  );

  // Creating Carpet
  const carpet = new RotatableEntity(
    new Transform({
      position: new Vector3(20.7079, 5.50579, 24.6273),
      rotation: Quaternion.Identity
    }),
    Quaternion.Euler(0, -10, 0)
  );

  carpet.addComponent(resources.models.carpet);

  // Creating Postit
  const postit = new ModelEntity(
    new Transform({
      position: new Vector3(21.571, 5.50857, 25.9534)
    }),
    resources.models.postit
  );

  // Creating Postit Hint
  const postitHint = new HintImage(gameCanvas, resources.textures.postitHint);

  // Adding OnClick Event
  postit.addComponent(
    new OnClick((): void => {
      postitHint.visible = true;
    })
  );
}
