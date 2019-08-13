import { MovableEntity, RotatableEntity } from "../gameObjects/index";
import utils from "../../node_modules/decentraland-ecs-utils/index";

export function CreateRoom4(): void {
  // Add a movable bookshelf which acts as the door for this room
  const bookshelf = new MovableEntity(
    new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(1.5, 0, 0),
    // Set a longer move time for the bookshelf
    3
  );

  // Add a book as a decoy
  const movableBook = new MovableEntity(
    new GLTFShape("models/room4/Puzzle04_Book2.glb"),
    new Transform({
      position: new Vector3(20.41, 6.4118, 10.4922)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    new Vector3(0, 0, -0.2)
  );
  // It moves when clicked, but doesn't unlock anything
  movableBook.addComponent(
    new OnClick((): void => {
      movableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // And a wine glass decoy
  const wineGlass = new MovableEntity(
    new GLTFShape("models/room4/Puzzle04_WGlass.glb"),
    new Transform({
      position: new Vector3(25.7505, 6.95786, 10.5917)
    }),
    new AudioClip("sounds/move_object2.mp3"),
    new Vector3(0.2, 0, 0)
  );
  wineGlass.addComponent(
    new OnClick((): void => {
      wineGlass.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // Add rotatable decoy objects as well
  const telescope = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Telescope.glb"),
    new Transform({
      position: new Vector3(22.6554, 7.02615, 10.6208)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(0, 127, 0)
  );
  telescope.addComponent(
    new OnClick((): void => {
      telescope.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const globe = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Globe.glb"),
    new Transform({
      position: new Vector3(21.2191, 7.11234, 10.6817),
      rotation: Quaternion.Euler(0.146, 34.9, -33.8)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(174, -26.43, -149.37)
  );

  globe.addComponent(
    new OnClick((): void => {
      globe.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const rotatableBook = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    new Transform({
      position: new Vector3(15.8321, 7.83095, 14.1252)
    }),
    new AudioClip("sounds/move_object1.mp3"),
    Quaternion.Euler(0, 0, -25)
  );

  rotatableBook.addComponent(
    new OnClick((): void => {
      rotatableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  // And finally the candle holder which is the key to this puzzle
  const candleHolder = new RotatableEntity(
    new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),
    new Transform({
      position: new Vector3(17.5056, 7.61611, 15.3835)
    }),
    new AudioClip("sounds/move_object2.mp3"),
    Quaternion.Euler(0, 0, 30)
  );

  // When clicked, it both rotates the candle holder itself and opens the "door" (moves the bookshelf)
  candleHolder.addComponent(
    new OnClick((): void => {
      candleHolder.getComponent(utils.ToggleComponent).toggle();
      bookshelf.getComponent(utils.ToggleComponent).toggle();
    })
  );
}
