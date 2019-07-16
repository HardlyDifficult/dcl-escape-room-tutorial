/**
 * Shared resources which may be used by multiple gameObjects, to improve performance.
 */

export default {
  sounds: {
    accessGranted: new AudioClip("sounds/access_granted.mp3"),
    accessDenied: new AudioClip("sounds/access_denied.mp3"),
    buttonPressed: new AudioClip("sounds/button.mp3"),
    doorSqueak: new AudioClip("sounds/door_squeak.mp3")
  },
  models: {
    carpet: new GLTFShape("models/room4/carpet.glb"),
    codePad: new GLTFShape("models/generic/codePad.glb"),
    coin: new GLTFShape("models/room4/coin.glb"),
    door: new GLTFShape("models/generic/door.glb"),
    scene: new GLTFShape("models/scene.glb")
  },
  textures: {
    clearButton: new Texture("images/codepad/pwdpanel_clear.png"),
    closeButton: new Texture("images/codepad/button_close.png"),
    coinHint: new Texture("images/room4/coinHint.png"),
    enterButton: new Texture("images/codepad/pwdpanel_enter.png"),
    fernPicture: new Texture("images/room4/fernpicture.png", {
      hasAlpha: true
    }),
    inputBox: new Texture("images/codepad/pwdpanel_input.png"),
    numberButton: new Texture("images/codepad/pwdpanel_buttons.png"),
    panelBackground: new Texture("images/codepad/pwdpanel_bg.png"),
    paintingHint: new Texture("images/room4/fernpictureHint.png")
  }
};
