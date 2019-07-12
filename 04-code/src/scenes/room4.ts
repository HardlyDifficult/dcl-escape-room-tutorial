import { ToggleComponent } from "../modules/toggleComponent";
import { RotateTransformComponent } from "../modules/transfromSystem";

export function CreateRoom4(gameCanvas: UICanvas) : void{

    // Importing Audio Clips
    let audioAccessGranted = new AudioClip("sounds/access_granted.mp3");
    let audioAccessDenied = new AudioClip("sounds/access_denied.mp3");
    
    // Importing Button Textures
    const buttonTexture = new Texture("images/codepad/pwdpanel_buttons.png");
    const inputTexture = new Texture("images/codepad/pwdpanel_input.png");
    const closeTexture = new Texture("images/codepad/button_close.png");
    
    // Importing Hint Images
    const fernTexture = new Texture("images/room4/fernpictureHint.png");
    const coinTexture = new Texture("images/room4/coinHint.png");

    // Creating Wall for Keypad
    const tempWall = new Entity();
    tempWall.addComponent(new PlaneShape());
    tempWall.addComponent(new Transform({position: new Vector3(19, 1.4, 13.1), scale: new Vector3(4, 3, 1)}));
    engine.addEntity(tempWall);

    // Creating Painting Hint UI for when painting is Clicked
    const paintingHintRect = CreateUIContainer(gameCanvas, null);
    const paintingHintImage = CreateUIImage(paintingHintRect, fernTexture, new Vector2(392,512), new Vector2(261,341), null);
    const paintingHintClose = CreateUIImage(paintingHintRect, closeTexture, new Vector2(32,32), new Vector2(32,32), new Vector2(196 - 32, 256 - 32));
    paintingHintClose.onClick = new OnClick(event =>{
        paintingHintRect.visible = false;
        gameCanvas.visible = false;
    });

    // Creating Painting
    const painting = new Entity();
    painting.addComponent(new PlaneShape());
    painting.addComponent(new Transform({position: new Vector3(18, 1.5, 13), scale: new Vector3(0.7, 1, 1), rotation: Quaternion.Euler(0, 0, 180)}));
    // Creating Material for Painting
    let paintingMat = new Material();
    paintingMat.albedoTexture = new Texture("images/room4/fernpicture.png", {hasAlpha: true});
    paintingMat.hasAlpha = true;
    // Applying Material and adding OnClick Event
    painting.addComponent(paintingMat);
    painting.addComponent(new OnClick(event =>{
        paintingHintRect.visible = true;
        gameCanvas.visible = true;
    }));

    engine.addEntity(painting);

    // Creating Keypad
    const keypad = new Entity();
    keypad.addComponent(new GLTFShape("models/generic/codePad.glb"));
    keypad.addComponent(new Transform({position: new Vector3(19.5, 1.5, 13)}));
    keypad.addComponent(new OnClick(event =>{
        panelRect.visible = true;
        gameCanvas.visible = true;
    }));
    engine.addEntity(keypad);

    // Creating Background UI for Keypad
    const panelTex = new Texture("images/codepad/pwdpanel_bg.png");;
    const panelRect = CreateUIContainer(gameCanvas, new Vector2(-50,50));
    const panelBg = CreateUIImage(panelRect, panelTex , new Vector2(222, 297), new Vector2(310, 420), new  Vector2(70, -55));

    // Creating Close Button for Keypad
    let panelCloseButton = CreateUIImage(panelRect, closeTexture, new  Vector2(32,32), new Vector2(32,32), new Vector2(204, 133));
    panelCloseButton.onClick = new OnClick(event =>{
        panelRect.visible = false;
        gameCanvas.visible = false;
    });

    // Creating Text for Keypad
    let panelText = new UIText(panelRect);
    panelText.positionY = 133;
    panelText.positionX = 16;
    panelText.hTextAlign = "left";
    panelText.vTextAlign = "center";
    panelText.fontSize = 30;
    panelText.value = "Enter Code";
    panelText.isPointerBlocker = false;

    // Set Position Offset for Buttons
    const panelPosition = new Vector2(0, -12);
    // Set Buttons Size
    const buttonSize = new Vector2(64, 64);
    // Set Space between Buttons
    const buttonSpace = new Vector2(5, 5);

    // Set current digit Index and Password value
    let currentInputIdx = 0;
    let password = "155";

        //create buttons for numerical path
        for (let col=0;col<3;col++){
            for (let row=0; row<4; row++){
                //references for button image and number text
                let buttonImage: UIImage = null;
                let numberText: UIText = null;
                //value of the number
                let value = (row*3 + col) + 1;
    
                //if it is in the last row in the middle we hardcode value to 0
                if (col == 1 && row == 3){
                    value = 0;
                }
                
                //at the bottom left we have the "clear" button
                if (col == 0 && row == 3){
                    //create image for button
                    buttonImage = new UIImage(panelRect, new Texture("images/codepad/pwdpanel_clear.png"));
                    //when clicked we reset text values and set digit index to 0
                    buttonImage.onClick = new OnClick(event =>{
                        panelInputs.forEach(inputSlot => {
                            inputSlot.text.value = "";
                            inputSlot.text.color = Color4.Black();
                        });
                        currentInputIdx = 0
                    })
                }
                //bottom right is "enter" button
                else if (col == 2 && row == 3){
                    //create image for button
                    buttonImage = new UIImage(panelRect, new Texture("images/codepad/pwdpanel_enter.png"));
                    //when clicked we check if entered password is correct
                    buttonImage.onClick = new OnClick(event =>{
                        let inputPwd = "";
                        for (let i=0; i<3; i++){
                            inputPwd = inputPwd + panelInputs[i].text.value;
                        }
                        //if password is correct
                        if (inputPwd == password){
                            panelInputs[0].text.value = "O";
                            panelInputs[0].text.color = Color4.Green();
                            panelInputs[1].text.value = "K";
                            panelInputs[1].text.color = Color4.Green();
                            panelInputs[2].text.value = "!";
                            panelInputs[2].text.color = Color4.Green();
                            keypad.addComponentOrReplace(new AudioSource(audioAccessGranted));
                            keypad.getComponent(AudioSource).playOnce();
                            //TODO: make something happen
                        }
                        //if password is incorrect
                        else{
                            panelInputs[0].text.value = "E";
                            panelInputs[0].text.color = Color4.Red();
                            panelInputs[1].text.value = "r";
                            panelInputs[1].text.color = Color4.Red();
                            panelInputs[2].text.value = "r";
                            panelInputs[2].text.color = Color4.Red();
                            currentInputIdx = 0;
                            keypad.addComponentOrReplace(new AudioSource(audioAccessDenied));
                            keypad.getComponent(AudioSource).playOnce();
                        }
                    })
                }
                //if it is a numerical button
                else{
                    //create image for button
                    buttonImage = new UIImage(panelRect, buttonTexture);
                    //create text for button
                    numberText = new UIText(panelRect);
                    numberText.isPointerBlocker = false;
                    //if clicked we set it value to the input boxes
                    buttonImage.onClick = new OnClick(event =>{
                        //clear inputs if we are entering a new digit and we had and error or other message displayed
                        if (currentInputIdx == 0 && panelInputs[0].text.value != ""){
                            panelInputs.forEach(inputSlot => {
                                inputSlot.text.value = "";
                                inputSlot.text.color = Color4.Black();
                            });
                        }
                        //if we can add an input we add it
                        if (currentInputIdx < 3){
                            panelInputs[currentInputIdx].text.value = value.toString();
                            currentInputIdx++;
                        }
                    })
                }
                //set image
                buttonImage.sourceWidth = 64;
                buttonImage.sourceHeight = 64;
                buttonImage.width = buttonSize.x;
                buttonImage.height = buttonSize.y;
                buttonImage.positionX = panelPosition.x + col * (buttonSpace.x + buttonSize.x);
                buttonImage.positionY = panelPosition.y - row * (buttonSpace.y + buttonSize.y);
    
                //if its a numerical button we set up it's text
                if (numberText != null){
                    numberText.width = buttonImage.width;
                    numberText.height = buttonImage.height;
                    numberText.positionX = buttonImage.positionX;
                    numberText.positionY = buttonImage.positionY;
                    numberText.fontAutoSize = true;
                    numberText.hTextAlign = "center";
                    numberText.isPointerBlocker = false;
                    numberText.value = value.toString();
                }
            }
        }
    
        //create the input boxes to show the digits entered by the user
        let panelInputs: {image: UIImage, text: UIText}[] = []
        for (let i=0; i<3; i++){
            let inputSlot = {image: new UIImage(panelRect, inputTexture), text: new UIText(panelRect)};
            inputSlot.image.sourceWidth = 64;
            inputSlot.image.sourceHeight = 64;
            inputSlot.image.width = inputSlot.text.width = buttonSize.x;
            inputSlot.image.height = inputSlot.text.height = buttonSize.y;
            inputSlot.image.positionX = inputSlot.text.positionX = i * (buttonSpace.x + buttonSize.x);
            inputSlot.image.positionY = inputSlot.text.positionY = 65;
            inputSlot.image.isPointerBlocker = inputSlot.text.isPointerBlocker = false;
            inputSlot.text.fontAutoSize = true;
            inputSlot.text.hTextAlign = "center";
            inputSlot.text.value = "";
            inputSlot.text.color = Color4.Black();
            panelInputs.push(inputSlot);
        }

    // Creating Carpet
    const carpet = new Entity();
    carpet.addComponent(new GLTFShape("models/room4/carpet.glb"));
    carpet.addComponent(new Transform({position: new Vector3(19,0,11)}));

    // Adding Toggle Component and OnClick Event - Toggle Not Working (Worked Before)
    carpet.addComponent(new ToggleComponent(ToggleComponent.State.Off, value=>{
        if (value == ToggleComponent.State.On){
            carpet.addComponentOrReplace(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,45,0), 0.7));
        }
        else{
            carpet.addComponentOrReplace(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,0,0), 0.7));
        }
    }));
    carpet.addComponent(new OnClick(event=>{
        carpet.getComponent(ToggleComponent).toggle();
    }));

    engine.addEntity(carpet);

    // Creating Hint UI for when Coin is Clicked
    const coinHintRect = CreateUIContainer(gameCanvas, null);
    const coinHintImage = CreateUIImage(coinHintRect, coinTexture, new Vector2(392, 512), new Vector2(261, 341), null);
    const coinHintClose = CreateUIImage(coinHintRect, closeTexture, new Vector2(32,32), new Vector2(32,32), new Vector2(196 - 32, 256 - 32));
    coinHintClose.onClick = new OnClick( event=>{
        coinHintRect.visible = false;
        gameCanvas.visible = false;
    });

    // Creating Coin
    const coin = new Entity();
    coin.addComponent(new GLTFShape("models/room4/coin.glb"));
    coin.addComponent(new Transform({position: new Vector3(18,0,10.5)}));
    coin.addComponent(new OnClick(event =>{
        coinHintRect.visible = true;
        gameCanvas.visible = true;
    }));
    engine.addEntity(coin);
}

// Helper Function to Build a UI Container Rect for Simplicity
function CreateUIContainer(gameCanvas: UICanvas, position?: Vector2): UIContainerRect{
    const result = new UIContainerRect(gameCanvas);

    if(position != null){
        result.positionX = position.x;
        result.positionY = position.y;
    }

    result.width = "100%";
    result.height = "100%";

    result.visible = false;
    return result;
}

// Helper Function to Build a UI Image for Simplicity
function CreateUIImage(uiRect: UIContainerRect, uiImage: Texture, sourceSize: Vector2, displaySize: Vector2, displayPosition?: Vector2): UIImage{
    const result = new UIImage(uiRect, uiImage);

    result.sourceWidth = sourceSize.x; 
    result.sourceHeight = sourceSize.y;

    result.width = displaySize.x;
    result.height = displaySize.y;

    if(displayPosition != null){
        result.positionX = displayPosition.x;
        result.positionY = displayPosition.y;
    }

    return result;
}