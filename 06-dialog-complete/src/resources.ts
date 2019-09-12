/**
 * Shared resources which may be used by multiple gameObjects, to improve performance.
 */

export default {
  sounds: {
    accessGranted: new AudioClip("sounds/access_granted.mp3"),
    accessDenied: new AudioClip("sounds/access_denied.mp3"),
    button: new AudioClip("sounds/button.mp3"),
    doorSqueak: new AudioClip("sounds/door_squeak.mp3"),
    moveObject1: new AudioClip("sounds/move_object1.mp3"),
    spotlight: new AudioClip("sounds/spotlight_on.mp3")
  },
  models: {
    scene: new GLTFShape("models/scene.glb"),

    door6: new GLTFShape("models/room6/Puzzle06_Door.glb"),
    muna: new GLTFShape("models/room6/Puzzle06_Muna.glb"),
    numpad2: new GLTFShape("models/room6/Numpad2.glb")

  },
  textures: {
    clearButton: new Texture("images/codepad/pwdpanel_clear.png"),
    closeButton: new Texture("images/codepad/button_close.png"),
    enterButton: new Texture("images/codepad/pwdpanel_enter.png"),
    inputBox: new Texture("images/codepad/pwdpanel_input.png"),
    numberButton: new Texture("images/codepad/pwdpanel_buttons.png"),
    panelBackground: new Texture("images/codepad/pwdpanel_bg.png"),
    
  playerPortraitDefault: new Texture("images/dialogs/player_default.png", {hasAlpha: true}),
  playerPortraitSurprised: new Texture("images/dialogs/player_surprised.png", {hasAlpha: true}),
  playerPortraitThinking: new Texture("images/dialogs/player_thinking.png", {hasAlpha: true}),
  npcPortraitDefault: new Texture("images/dialogs/dog_default.png", {hasAlpha: true}),
  npcPortraitSurprised: new Texture("images/dialogs/dog_surprised.png", {hasAlpha: true}),
  npcPortraitThinking: new Texture("images/dialogs/dog_thinking.png", {hasAlpha: true})
  }
};
