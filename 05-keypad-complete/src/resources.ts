/**
 * Shared resources which may be used by multiple gameObjects, to improve performance.
 */

export default {
  sounds: {
    accessGranted: new AudioClip("sounds/access_granted.mp3"),
    accessDenied: new AudioClip("sounds/access_denied.mp3"),
    doorSqueak: new AudioClip("sounds/door_squeak.mp3")
  },
  models: {
    scene: new GLTFShape("models/scene.glb"),

    carpet: new GLTFShape("models/room5/Puzzle05_Carpet.glb"),
    postit: new GLTFShape("models/room5/Puzzle05_Postit.glb"),
    pictureFrame: new GLTFShape("models/room5/Puzzle05_PictureMain.glb"),

    door5: new GLTFShape("models/room5/Puzzle05_Door.glb")
  },
  textures: {
    buttonTexture: new Texture("images/codepad/pwdpanel_buttons.png"),
    inputButton: new Texture("images/codepad/pwdpanel_input.png"),
    closeButton: new Texture("images/codepad/button_close.png"),
    closeHintButton: new Texture("images/room5/button_close.png"),

    keypadBackground: new Texture("images/codepad/pwdpanel_bg.png"),
    clearButton: new Texture("images/codepad/pwdpanel_clear.png"),
    enterButton: new Texture("images/codepad/pwdpanel_enter.png"),

    fernHint: new Texture("images/room5/fernpictureHint.png"),
    postitHint: new Texture("images/room5/Postit_001.png")
  }
};
