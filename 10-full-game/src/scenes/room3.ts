import utils from "../../node_modules/decentraland-ecs-utils/index";
import { Button, Door, MovableEntity } from "../gameObjects/index";
import resources from "../resources";

export function CreateRoom3(): void {
  const door = new Door(
    resources.models.door3,
    { position: new Vector3(24.1166, 7.17, 15.78) },
    resources.sounds.whip
  );
  door.isOpen = true;

  const trigger = new Entity();
  engine.addEntity(trigger);
  trigger.addComponent(
    new Transform({ position: new Vector3(25.5, 7.17, 19.5) })
  );
  trigger.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(4.2, 3, 8), Vector3.Zero()),
      0,
      0,
      null,
      null,
      (): void => {
        door.closeDoor();
      },
      (): void => {
        door.openDoor(false);
      }
    )
  );

  const button = new Button(resources.models.roundButton, {
    position: new Vector3(22.4456, 5.92706, 24.18)
  });

  button.addComponent(
    new OnClick((): void => {
      button.press();
      door.openDoor(false);
      trigger.getComponent(utils.TriggerComponent).enabled = false;
    })
  );

  const fern1 = new MovableEntity(
    resources.models.plant1,
    { position: new Vector3(23.2489, 5.5071, 23.813) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, -0.5)
  );
  fern1.addComponent(
    new OnClick((): void => {
      fern1.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const fern2 = new MovableEntity(
    resources.models.plant2,
    { position: new Vector3(26.9356, 5.52006, 23.4817) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, -0.5)
  );
  fern2.addComponent(
    new OnClick((): void => {
      fern2.getComponent(utils.ToggleComponent).toggle();
    })
  );
  const fern3 = new MovableEntity(
    resources.models.plant3,
    { position: new Vector3(23.4513, 5.50571, 16.8218) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, 0.5)
  );
  fern3.addComponent(
    new OnClick((): void => {
      fern3.getComponent(utils.ToggleComponent).toggle();
    })
  );
  const fern4 = new MovableEntity(
    resources.models.plant4,
    { position: new Vector3(26.9878, 5.51511, 16.8279) },
    resources.sounds.moveObject1,
    new Vector3(0, 0, 0.5)
  );
  fern4.addComponent(
    new OnClick((): void => {
      fern4.getComponent(utils.ToggleComponent).toggle();
    })
  );
}
