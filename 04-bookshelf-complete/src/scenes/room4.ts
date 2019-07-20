import { BookShelf } from "../gameObjects/bookShelf";
import { Chanderlier } from "../gameObjects/chanderlier";
import { GenericMove } from "../gameObjects/genericMove";
import { GenericRotate } from "../gameObjects/genericRotate";
import { GenericModel } from "../gameObjects/genericModel";

export function CreateRoom4(): void {
  // Creating Audio Clips for Several Entities
  let audioClipMoveObject1 = new AudioClip("sounds/move_object1.mp3");
  let audioClipMoveObject2 = new AudioClip("sounds/move_object2.mp3");

  // Creating Bookshelf
  let bookshelf = new BookShelf(
    new Transform({
      position: new Vector3(15.525, 0, 6.53),
      rotation: Quaternion.Euler(0, 90, 0)
    })
  );

  // Creating Candlestick Holder but they call it Chanderlier so whatever
  let chandelier = new Chanderlier(
    new Transform({
      position: new Vector3(0.4, 1.5, -0.05),
      rotation: Quaternion.Identity
    })
  );

  // Setting Chanderlier Parent
  chandelier.setParent(bookshelf);

  chandelier.addComponent(
    new OnClick((): void => {
      chandelier.ToggleChanderlier();
      bookshelf.ToggleBookshelf();
    })
  );

  // Creating Book
  let book = new GenericRotate(
    new Transform({
      position: new Vector3(-0.8, 0.59, -0.19),
      rotation: Quaternion.Euler(0, -90, 0)
    }),
    Quaternion.Euler(0, -90, 25)
  );
  book.setParent(bookshelf);

  // Adding Unique Book Components
  book.addComponent(new GLTFShape("models/room4/book.glb"));
  book.addComponent(new AudioSource(audioClipMoveObject1));

  // Creating Couch
  let couch = new GenericMove(
    new Transform({
      position: new Vector3(15, 0, 2.5)
    }),
    new Vector3(0, 0, 0.4)
  );

  // Adding Unique Couch Components
  couch.addComponent(new GLTFShape("models/room4/couch.glb"));
  couch.addComponent(new AudioSource(audioClipMoveObject1));

  // Creating Table
  let table = new GenericModel(
    new GLTFShape("models/room4/table.glb"),
    new Transform({
      position: new Vector3(8.63, 0, 3.63)
    })
  );

  // Creating Wine Bottle
  let wineBottle = new GenericMove(
    new Transform({
      position: new Vector3(8.53, 1.011, 3.72)
    }),
    new Vector3(-0.2, 0, 0)
  );

  // Adding Unique Bottle Components
  wineBottle.addComponent(new GLTFShape("models/room4/winebottle.glb"));
  wineBottle.addComponent(new AudioSource(audioClipMoveObject2));

  // Creating Wine Glass
  let wineGlass = new GenericMove(
    new Transform({
      position: new Vector3(8.72, 1.041, 3.42)
    }),
    new Vector3(0, 0, -0.2)
  );

  // Adding Unique Glass Components
  wineGlass.addComponent(new GLTFShape("models/room4/wineglass.glb"));
  wineGlass.addComponent(new AudioSource(audioClipMoveObject2));

  // Creating Chair
  let chair = new GenericRotate(
    new Transform({
      position: new Vector3(9.22, 0, 3.86),
      rotation: Quaternion.Identity
    }),
    Quaternion.Euler(0, 15, 0)
  );

  // Adding Unique Chair Components
  chair.addComponent(new GLTFShape("models/room4/chair.glb"));
  chair.addComponent(new AudioSource(audioClipMoveObject1));

  // Creating Wall Painting
  let wallPainting = new GenericRotate(
    new Transform({
      position: new Vector3(12.33, 2.65, 0.31),
      rotation: Quaternion.Euler(90, 0, 0)
    }),
    Quaternion.Euler(90, 10, 0)
  );

  // Adding Unique Painting Components
  wallPainting.addComponent(new GLTFShape("models/room4/manacoin.glb"));
  wallPainting.addComponent(new AudioSource(audioClipMoveObject1));

  // Creating Fake Door
  let fakeDoor = new GenericModel(
    new GLTFShape("models/generic/door.glb"),
    new Transform({
      position: new Vector3(10.5, 0, 0.4)
    })
  );
}
