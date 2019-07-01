import {Door} from '../gameObjects/door'

/**
 * Room 1: Open a door
 */
export function CreateRoom1(): void {
  let door = new Door({ position: new Vector3(6.58, 0, 7.85) });

  /**
   * Add an OnClick event handler to `openDoor`.
   */
  door.addComponent(
    new OnClick((): void => {
      door.openDoor();
    })
  );
}
