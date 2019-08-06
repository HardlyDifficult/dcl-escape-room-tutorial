/**
 * Shared resources which may be used by multiple gameObjects, to improve performance.
 */

export default {
  sounds: {
    moveObject1: new AudioClip("sounds/move_object1.mp3"),
    moveObject2: new AudioClip("sounds/move_object2.mp3")
  },
  models: {
    baseScene: new GLTFShape("models/scene.glb"),
    bookshelf: new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),

    book1: new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    book2: new GLTFShape("models/room4/Puzzle04_Book2.glb"),

    wineGlass: new GLTFShape("models/room4/Puzzle04_WGlass.glb"),
    candleHolder: new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),

    telescope: new GLTFShape("models/room4/Puzzle04_Telescope.glb"),
    globe: new GLTFShape("models/room4/Puzzle04_Globe.glb")
  }
};
