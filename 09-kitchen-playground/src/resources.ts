export default {
  sounds: {
    doorSqueek: new AudioClip("sounds/door_squeak.mp3"),
    fanAudio: new AudioClip("sounds/fan.mp3")
  },
  models: {
    door9: new GLTFShape("models/room9/Puzzle09_Door.glb"),
    mouseWill: new GLTFShape("models/room9/Puzzle09_MouseWill.glb"),
    fanModel: new GLTFShape("models/room9/Fan.glb"),
    drawer: new GLTFShape("models/room9/Drawer.glb"),
    kitchenModel: new GLTFShape("models/room9/Puzzle09_Game.glb")
  },
  textures: {
    bubble: new Texture("images/room9/bubbleTexture.png", { hasAlpha: false })
  }
};
