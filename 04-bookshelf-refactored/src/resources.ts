/**
 * Shared resources which may be used by multiple gameObjects, to improve performance.
 */

export default {
  sounds: {
    button: new AudioClip("sounds/button.mp3"),
    doorSqueak: new AudioClip("sounds/door_squeak.mp3"),
    moveObject1: new AudioClip("sounds/move_object1.mp3"),
    moveObject2: new AudioClip("sounds/move_object2.mp3"),
    whip: new AudioClip("sounds/room3/whip.mp3"),
  },
  models: {
    book1: new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    book2: new GLTFShape("models/room4/Puzzle04_Book2.glb"),
    candleHolder: new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),
    door1: new GLTFShape("models/room1/Puzzle01_Door.glb"),
    door2: new GLTFShape("models/room2/Puzzle02_Door.glb"),
    door3: new GLTFShape("models/room3/Puzzle03_Door.glb"),
    door4: new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
    glass: new GLTFShape("models/room4/Puzzle04_WGlass.glb"),
    globe: new GLTFShape("models/room4/Puzzle04_Globe.glb"),
    plant1: new GLTFShape("models/room3/Puzzle03_Plant1.glb"),
    plant2: new GLTFShape("models/room3/Puzzle03_Plant2.glb"),
    plant3: new GLTFShape("models/room3/Puzzle03_Plant3.glb"),
    plant4: new GLTFShape("models/room3/Puzzle03_Plant4.glb"),
    roundButton: new GLTFShape("models/generic/Round_Button.glb"),
    scene: new GLTFShape("models/scene.glb"),
    squareButton: new GLTFShape("models/room2/Square_Button.glb"),
    telescope: new GLTFShape("models/room4/Puzzle04_Telescope.glb"),
  }
}