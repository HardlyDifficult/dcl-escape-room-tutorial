import { MovableEntity, RotatableEntity } from "../gameObjects/index";
import utils from "../../node_modules/decentraland-ecs-utils/index";
// Importing new Resources File
import resources from "../resources";

export function CreateRoom4(): void {
  const bookshelf = new MovableEntity(
    // Using Resources to Obtain Model
    resources.models.bookshelf,
    new Transform({
      position: new Vector3(20.6557, 5.4996, 15.041)
    }),
    // Using Resources to Obtain Sound
    resources.sounds.moveObject1,
    new Vector3(1.5, 0, 0),
    3
  );

  const movableBook = new MovableEntity(
    resources.models.book2,
    new Transform({
      position: new Vector3(20.41, 6.4118, 10.4922)
    }),
    resources.sounds.moveObject1,
    new Vector3(0, 0, -0.2)
  );
  movableBook.addComponent(
    new OnClick((): void => {
      movableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const wineGlass = new MovableEntity(
    resources.models.wineGlass,
    new Transform({
      position: new Vector3(25.7505, 6.95786, 10.5917)
    }),
    resources.sounds.moveObject2,
    new Vector3(0.2, 0, 0)
  );
  wineGlass.addComponent(
    new OnClick((): void => {
      wineGlass.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const telescope = new RotatableEntity(
    resources.models.telescope,
    new Transform({
      position: new Vector3(22.6554, 7.02615, 10.6208)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(0, 127, 0)
  );
  telescope.addComponent(
    new OnClick((): void => {
      telescope.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const globe = new RotatableEntity(
    resources.models.globe,
    new Transform({
      position: new Vector3(21.2191, 7.11234, 10.6817),
      rotation: Quaternion.Euler(0.146, 34.9, -33.8)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(174, -26.43, -149.37)
  );

  globe.addComponent(
    new OnClick((): void => {
      globe.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const rotatableBook = new RotatableEntity(
    resources.models.book1,
    new Transform({
      position: new Vector3(15.8321, 7.83095, 14.1252)
    }),
    resources.sounds.moveObject1,
    Quaternion.Euler(0, 0, -25)
  );

  rotatableBook.addComponent(
    new OnClick((): void => {
      rotatableBook.getComponent(utils.ToggleComponent).toggle();
    })
  );

  const candleHolder = new RotatableEntity(
    resources.models.candleHolder,
    new Transform({
      position: new Vector3(17.5056, 7.61611, 15.3835)
    }),
    resources.sounds.moveObject2,
    Quaternion.Euler(0, 0, 30)
  );

  candleHolder.addComponent(
    new OnClick((): void => {
      candleHolder.getComponent(utils.ToggleComponent).toggle();
      bookshelf.getComponent(utils.ToggleComponent).toggle();
    })
  );
}
