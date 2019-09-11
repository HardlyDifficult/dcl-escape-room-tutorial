import { Door, ToggleEntity, Button } from "../gameObjects/index";
import resources from "../resources";

export function CreateRoom7(): void {
  let areButtonsEnabled = true;

  // Puzzle Lightbulbs
  const lightbulbs: ToggleEntity[] = [
    new ToggleEntity(
      { position: new Vector3(23.408, 2.26006, 10.3273) },
      new GLTFShape("models/room7/Puzzle07_LightOn.glb"),
      new GLTFShape("models/room7/Puzzle07_LightOff.glb")
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.22122, 11.1682) },
      new GLTFShape("models/room7/Puzzle07_LightOn.glb"),
      new GLTFShape("models/room7/Puzzle07_LightOff.glb")
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.10693, 12.1568) },
      new GLTFShape("models/room7/Puzzle07_LightOn.glb"),
      new GLTFShape("models/room7/Puzzle07_LightOff.glb")
    ),
    new ToggleEntity(
      { position: new Vector3(23.408, 2.24542, 13.1888) },
      new GLTFShape("models/room7/Puzzle07_LightOn.glb"),
      new GLTFShape("models/room7/Puzzle07_LightOff.glb")
    )
  ];

  const AreAllLightsOn = (): boolean => {
    for (const bulb of lightbulbs) {
      if (!bulb.IsLightOn()) {
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
      lightbulbs[1].Toggle();
      lightbulbs[2].Toggle();
      lightbulbs[3].Toggle();
    },
    (): void => {
      lightbulbs[2].Toggle();
      lightbulbs[3].Toggle();
    },
    (): void => {
      lightbulbs[0].Toggle();
      lightbulbs[3].Toggle();
    },
    (): void => {
      lightbulbs[0].Toggle();
      lightbulbs[2].Toggle();
      lightbulbs[3].Toggle();
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

          if (AreAllLightsOn()) {
            areButtonsEnabled = false;
            tvScreen.SetOn();
          }
        }
      })
    );
  }

  // Adding Door for the Room
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
}
