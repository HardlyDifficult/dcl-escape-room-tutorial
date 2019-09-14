export default {
  sounds: {
    button: new AudioClip("sounds/button.mp3"),
    doorSqueek: new AudioClip("sounds/door_squeak.mp3")
  },
  models: {
    roundButton: new GLTFShape("models/generic/Round_Button.glb"),

    tvOff: new GLTFShape("models/room7/TVColor.glb"),
    tvOn: new GLTFShape("models/room7/TVOrange.glb"),

    door7: new GLTFShape("models/room7/Puzzle07_Door.glb"),
    lightOn: new GLTFShape("models/room7/Puzzle07_LightOn.glb"),
    lightOff: new GLTFShape("models/room7/Puzzle07_LightOff.glb")
  }
};
