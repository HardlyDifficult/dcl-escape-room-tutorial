import utils from "../../node_modules/decentraland-ecs-utils/index";

/**
 * An object which moves from one position to another when toggled.
 */
export class MovableEntity extends Entity {
  constructor(
    model: GLTFShape,
    transform: TranformConstructorArgs,
    sound: AudioClip,
    deltaPosition: Vector3
  ) {
    super();
    engine.addEntity(this);

    this.addComponent(model);
    this.addComponent(new Transform(transform));
    this.addComponent(new AudioSource(sound));

    // Save the positions to move between
    const startPos = transform.position;
    const endPos = transform.position.add(deltaPosition);

    // Add a Toggle component which defaults to Off
    this.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, (value): void => {
        // On change
        
        if (value == utils.ToggleState.On) {
          // Move to the endPos when toggled on
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              endPos,
              0.5
            )
          );
        } else {
          // Move to the startPos when toggled off
          this.addComponentOrReplace(
            new utils.MoveTransformComponent(
              this.getComponent(Transform).position,
              startPos,
              0.5
            )
          );
        }

        // And play the sound effect
        this.getComponent(AudioSource).playOnce();
      })
    );
  }
}
