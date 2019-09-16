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
    accessGranted: new AudioClip("sounds/access_granted.mp3"),
    accessDenied: new AudioClip("sounds/access_denied.mp3"),
    spotlight: new AudioClip("sounds/spotlight_on.mp3"),
    doorSqueek: new AudioClip("sounds/door_squeak.mp3"),
    fanAudio: new AudioClip("sounds/fan.mp3")
  },
  models: {
    book1: new GLTFShape("models/room4/Puzzle04_Book1.glb"),
    book2: new GLTFShape("models/room4/Puzzle04_Book2.glb"),
    candleHolder: new GLTFShape("models/room4/Puzzle04_CandleHolder.glb"),

    door1: new GLTFShape("models/room1/Puzzle01_Door.glb"),
    door2: new GLTFShape("models/room2/Puzzle02_Door.glb"),
    door3: new GLTFShape("models/room3/Puzzle03_Door.glb"),
    door4: new GLTFShape("models/room4/Puzzle04_LibraryDoor.glb"),
    door5: new GLTFShape("models/room5/Puzzle05_Door.glb"),
    door6: new GLTFShape("models/room6/Puzzle06_Door.glb"),
    door7: new GLTFShape("models/room7/Puzzle07_Door.glb"),
    door8: new GLTFShape("models/room8/Puzzle08_Door.glb"),
    door9: new GLTFShape("models/room9/Puzzle09_Door.glb"),

    mouseWill: new GLTFShape("models/room9/Puzzle09_MouseWill.glb"),
    fanModel: new GLTFShape("models/room9/Fan.glb"),
    drawer: new GLTFShape("models/room9/Drawer.glb"),
    kitchenModel: new GLTFShape("models/room9/Puzzle09_Game.glb"),

    mouse: new GLTFShape("models/room8/Mouse.glb"),
    ticket: new GLTFShape("models/room8/Ticket.glb"),
    numpad1: new GLTFShape("models/room5/Numpad1.glb"),
    numpad2: new GLTFShape("models/room6/Numpad2.glb"),
    carpet: new GLTFShape("models/room5/Puzzle05_Carpet.glb"),
    postit: new GLTFShape("models/room5/Puzzle05_Postit.glb"),
    pictureFrame: new GLTFShape("models/room5/Puzzle05_PictureMain.glb"),
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
    muna: new GLTFShape("models/room6/Puzzle06_Muna.glb"),
    spotlight: new GLTFShape("models/room6/spotlightlight.glb"),

    tvOff: new GLTFShape("models/room7/TVColor.glb"),
    tvOn: new GLTFShape("models/room7/TVOrange.glb"),
    lightOnSrc: "models/room7/Puzzle07_LightOn.glb",
    lightOffSrc: "models/room7/Puzzle07_LightOff.glb"
  },
  textures: {
    closeHintButton: new Texture("images/room5/button_close.png"),

    fernHint: new Texture("images/room5/fernpictureHint.png"),
    postitHint: new Texture("images/room5/Postit_001.png"),

    clearButton: new Texture("images/codepad/pwdpanel_clear.png"),
    closeButton: new Texture("images/codepad/button_close.png"),
    enterButton: new Texture("images/codepad/pwdpanel_enter.png"),
    inputBox: new Texture("images/codepad/pwdpanel_input.png"),
    numberButton: new Texture("images/codepad/pwdpanel_buttons.png"),
    panelBackground: new Texture("images/codepad/pwdpanel_bg.png"),

    textContainer: new Texture("images/dialogs/textContainer.png"),
    optionsContainer: new Texture("images/dialogs/optionsContainer.png"),
    playerPortraitDefault: new Texture("images/dialogs/player_default.png", {
      hasAlpha: true
    }),
    playerPortraitSurprised: new Texture(
      "images/dialogs/player_surprised.png",
      { hasAlpha: true }
    ),
    playerPortraitThinking: new Texture("images/dialogs/player_thinking.png", {
      hasAlpha: true
    }),
    npcPortraitDefault: new Texture("images/dialogs/dog_default.png", {
      hasAlpha: true
    }),
    npcPortraitSurprised: new Texture("images/dialogs/dog_surprised.png", {
      hasAlpha: true
    }),
    npcPortraitThinking: new Texture("images/dialogs/dog_thinking.png", {
      hasAlpha: true
    }),
    bubble: new Texture("images/room9/bubbleTexture.png", {
      hasAlpha: false
    })
  }
};
