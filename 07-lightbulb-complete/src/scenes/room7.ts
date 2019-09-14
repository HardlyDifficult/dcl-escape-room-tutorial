import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import { Door, ToggleEntity, Button } from "../gameObjects/index";

export function CreateRoom7(): void {
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

  let areButtonsEnabled = true;

  // Puzzle Lightbulbs
  const lightbulbs: ToggleEntity[] = [
    new ToggleEntity(
      { position: new Vector3(23.408, 2.26006, 10.3273) },
      resources.models.lightOn,
      resources.models.lightOff
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.22122, 11.1682) },
      resources.models.lightOn,
      resources.models.lightOff
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.10693, 12.1568) },
      resources.models.lightOn,
      resources.models.lightOff
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.24542, 13.1888) },
      resources.models.lightOn,
      resources.models.lightOff
    )
  ];

  const areAllLightsOn = (): boolean => {
    for (const bulb of lightbulbs) {
      if (!bulb.getComponent(utils.ToggleComponent).isOn()) {
        return false;
      }
    }
    return true;
  };

  // Creating TV Hint Screen
  const tvScreen = new ToggleEntity(
    { position: new Vector3(26.91, 0, 10.44) },
    resources.models.tvOn,
    resources.models.tvOff
  );

  const buttonInteractions = [
    (): void => {
      lightbulbs[1].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[2].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[3].getComponent(utils.ToggleComponent).toggle();
    },
    (): void => {
      lightbulbs[2].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[3].getComponent(utils.ToggleComponent).toggle();
    },
    (): void => {
      lightbulbs[0].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[3].getComponent(utils.ToggleComponent).toggle();
    },
    (): void => {
      lightbulbs[0].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[2].getComponent(utils.ToggleComponent).toggle();
      lightbulbs[3].getComponent(utils.ToggleComponent).toggle();
    }
  ];
  const buttonsPosition = [
    new Vector3(23.0891, 1.58507, 10.2526),
    new Vector3(23.0891, 1.48205, 11.2557),
    new Vector3(23.0891, 1.38123, 12.2855),
    new Vector3(23.0891, 1.52253, 13.2941)
  ];

  for (let i = 0; i < buttonsPosition.length; i++) {
    const button = new Button(resources.models.roundButton, {
      position: buttonsPosition[i]
    });
    button.addComponent(
      new OnClick((): void => {
        if (areButtonsEnabled) {
          buttonInteractions[i]();
          button.press();

          if (areAllLightsOn()) {
            areButtonsEnabled = false;
            tvScreen
              .getComponent(utils.ToggleComponent)
              .set(utils.ToggleState.On);
          }
        }
      })
    );
  }
}
