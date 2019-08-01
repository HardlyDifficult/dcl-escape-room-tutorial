import utils from "../../node_modules/decentraland-ecs-utils/index";
import { ToggleDoor } from "../gameObjects/toggleDoor";
import { MovableEntity } from "../gameObjects/movableEntity";
import { Button } from "../gameObjects/button";

export function CreateRoom3(): void {
  // Creating Spike Door
  let spike = new ToggleDoor(
    new Transform({
      position: new Vector3(24.1166, 7.17, 15.78)
    }),
    new GLTFShape("models/room3/Puzzle03_Door.glb"),
    new AudioClip("sounds/room3/whip.mp3")
  );

  // Toggling Door so it's in the Correct State
  spike.ToggleDoor(false);

  // Creating Trigger
  let spikeTrigger = new Entity();
  engine.addEntity(spikeTrigger);

  // Adding Trigger Transform
  spikeTrigger.addComponent(
    new Transform({ position: new Vector3(25.5, 7.17, 19.5) })
  );
  spikeTrigger.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(new Vector3(4.2, 3, 8), Vector3.Zero()),
      0,
      0,
      null,
      null,
      (): void => {
        spike.CloseDoor(true);
      },
      (): void => {
        spike.OpenDoor(false);
      }
    )
  );

  // Creating Big Red Button
  let button = new Button(
    new Transform({
      position: new Vector3(22.4456, 5.92706, 24.18)
    })
  );

  // Adding OnClick Event
  button.addComponent(
    new OnClick((): void => {
      if (spikeTrigger.getComponent(utils.TriggerComponent).enabled) {
        spikeTrigger.getComponent(utils.TriggerComponent).enabled = false;

        spike.OpenDoor(false);
        button.Pressed();
      }
    })
  );

  // Creating Plants Audio
  let plantAudio = new AudioClip("sounds/move_object1.mp3");

  // Creating Movable Plant1
  let fern1 = new MovableEntity(
    new Transform({
      position: new Vector3(23.2489, 5.5071, 23.813)
    }),
    new Vector3(0, 0, -0.5)
  );

  fern1.addComponent(new AudioSource(plantAudio));
  fern1.addComponent(new GLTFShape("models/room3/Puzzle03_Plant1.glb"));

  // Creating Movable Plant2
  let fern2 = new MovableEntity(
    new Transform({
      position: new Vector3(26.9356, 5.52006, 23.4817)
    }),
    new Vector3(0, 0, -0.5)
  );

  fern2.addComponent(new AudioSource(plantAudio));
  fern2.addComponent(new GLTFShape("models/room3/Puzzle03_Plant2.glb"));

  // Creating Movable Plant3
  let fern3 = new MovableEntity(
    new Transform({
      position: new Vector3(23.4513, 5.50571, 16.8218)
    }),
    new Vector3(0, 0, 0.5)
  );

  fern3.addComponent(new AudioSource(plantAudio));
  fern3.addComponent(new GLTFShape("models/room3/Puzzle03_Plant3.glb"));

  // Creating Movable Plant4
  let fern4 = new MovableEntity(
    new Transform({
      position: new Vector3(26.9878, 5.51511, 16.8279)
    }),
    new Vector3(0, 0, 0.5)
  );

  fern4.addComponent(new AudioSource(plantAudio));
  fern4.addComponent(new GLTFShape("models/room3/Puzzle03_Plant4.glb"));
}
