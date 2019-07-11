import { ToggleComponent } from "../modules/toggleComponent";
import { RotateTransformComponent } from "../modules/transfromSystem";

export function CreateRoom4(gameCanvas: UICanvas) : void{
    //audio clips
    let audioAccessGranted = new AudioClip("sounds/access_granted.mp3");
    let audioAccessDenied = new AudioClip("sounds/access_denied.mp3");

    //create rect to contain numerical pad
    const panelRect = new UIContainerRect(gameCanvas);
    panelRect.positionX = -50;
    panelRect.positionY = 50;
    panelRect.width = "100%";
    panelRect.height = "100%";
    panelRect.visible = false;

    //create texture for buttons
    const buttonTexture = new Texture("images/codepad/pwdpanel_buttons.png");
    const inputTexture = new Texture("images/codepad/pwdpanel_input.png");
    const closeTexture = new Texture("images/codepad/button_close.png");

    //background for numerical pad
    const panelBg = new UIImage(panelRect, new Texture("images/codepad/pwdpanel_bg.png"));
    panelBg.sourceWidth = 222;
    panelBg.sourceHeight = 297;
    panelBg.width = 310;
    panelBg.height = 420;
    panelBg.positionX = 70;
    panelBg.positionY = -55;

    //close button for numerical pad
    let panelCloseButton = new UIImage(panelRect, closeTexture);
    panelCloseButton.sourceWidth = 32;
    panelCloseButton.sourceHeight = 32;
    panelCloseButton.positionX = 204;
    panelCloseButton.positionY = 133;
    panelCloseButton.width = 32;
    panelCloseButton.height = 32;
    panelCloseButton.onClick = new OnClick(event=>{
        panelRect.visible = false;
        gameCanvas.visible = false;
    });

    //text dor numerical pad
    let panelText = new UIText(panelRect);
    panelText.positionY = 133;
    panelText.positionX = 16;
    panelText.hTextAlign = "left";
    panelText.vTextAlign = "center";
    panelText.fontSize = 30;
    panelText.value = "Enter Code";
    panelText.isPointerBlocker = false;

    //set position offset for buttons
    const panelPosition = new Vector2(0, -12);
    //set buttons size
    const buttonSize = new Vector2(64, 64);
    //set space between buttons
    const buttonSpace = new Vector2(5, 5);

    //set current digit index and password value
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
                        numPadLock.addComponentOrReplace(new AudioSource(audioAccessGranted));
                        numPadLock.getComponent(AudioSource).playOnce();
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
                        numPadLock.addComponentOrReplace(new AudioSource(audioAccessDenied));
                        numPadLock.getComponent(AudioSource).playOnce();
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

    //create a carpet on the ground
    const carpet = new Entity();
    carpet.addComponent(new GLTFShape("models/room4/carpet.glb"));
    carpet.addComponent(new Transform({position: new Vector3(19,0,11)}));
    carpet.addComponent(new ToggleComponent(ToggleComponent.State.Off, value=>{
        if (value == ToggleComponent.State.On){
            carpet.addComponent(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,45,0), 0.7));
        }
        else{
            carpet.addComponent(new RotateTransformComponent(carpet.getComponent(Transform).rotation, Quaternion.Euler(0,0,0), 0.7));
        }
    }));
    carpet.addComponent(new OnClick(event=>{
        carpet.getComponent(ToggleComponent).toggle();
    }));
    engine.addEntity(carpet);

    //create a coin under the carpet
    const coin = new Entity();
    coin.addComponent(new GLTFShape("models/room4/coin.glb"));
    coin.addComponent(new Transform({position: new Vector3(18,0,10.5)}));
    coin.addComponent(new OnClick(event =>{
        coinHintRect.visible = true;
        gameCanvas.visible = true;
    }))
    engine.addEntity(coin);

    //create hint ui image to show when coin is clicked
    const coinHintRect = new UIContainerRect(gameCanvas);
    coinHintRect.width = "100%";
    coinHintRect.height = "100%";
    coinHintRect.visible = false;
    const coinHintImage = new UIImage(coinHintRect, new Texture("images/room4/coinHint.png"));
    coinHintImage.sourceWidth = 392;
    coinHintImage.sourceHeight = 512;
    coinHintImage.width = 261;
    coinHintImage.height = 341;

    //create "close" button for the coin's hint ui
    const coinHintClose = new UIImage(coinHintRect, closeTexture);
    coinHintClose.sourceWidth = 32;
    coinHintClose.sourceHeight = 32;
    coinHintClose.width = 32;
    coinHintClose.height = 32;
    coinHintClose.positionX = 196 - 32;
    coinHintClose.positionY = 256 - 32;
    coinHintClose.onClick = new OnClick(event =>{
        coinHintRect.visible = false;
        gameCanvas.visible = false;
    });

    //create a painting on the wall
    const painting = new Entity();
    painting.addComponent(new PlaneShape());
    painting.addComponent(new Transform({position: new Vector3(18, 1.5, 13), scale: new Vector3(0.7,1,1), rotation: Quaternion.Euler(0,0,180)}));
    let paintingMat = new Material();
    paintingMat.albedoTexture = new Texture("images/room4/fernpicture.png", {hasAlpha: true});
    paintingMat.hasAlpha = true;
    painting.addComponent(paintingMat);
    painting.addComponent(new OnClick(event =>{
        paintingHintRect.visible = true;
        gameCanvas.visible = true;
    }));
    engine.addEntity(painting);

    //create hint ui image to show when painting is clicked
    const paintingHintRect = new UIContainerRect(gameCanvas);
    paintingHintRect.width = "100%";
    paintingHintRect.height = "100%";
    paintingHintRect.visible = false;
    const paintingHintImage = new UIImage(paintingHintRect, new Texture("images/room4/fernpictureHint.png"));
    paintingHintImage.sourceWidth = 392;
    paintingHintImage.sourceHeight = 512;
    paintingHintImage.width = 261;
    paintingHintImage.height = 341;

    //create "close" button for the painting's hint ui
    const paintingHintClose = new UIImage(paintingHintRect, closeTexture);
    paintingHintClose.sourceWidth = 32;
    paintingHintClose.sourceHeight = 32;
    paintingHintClose.width = 32;
    paintingHintClose.height = 32;
    paintingHintClose.positionX = 196 - 32;
    paintingHintClose.positionY = 256 - 32;
    paintingHintClose.onClick = new OnClick(event =>{
        paintingHintRect.visible = false;
        gameCanvas.visible = false;
    });

    //create the numpad lock
    const numPadLock = new Entity();
    numPadLock.addComponent(new GLTFShape("models/generic/codePad.glb"));
    numPadLock.addComponent(new Transform({position: new Vector3(19.5,1.5,13)}));
    numPadLock.addComponent(new OnClick(event =>{
        panelRect.visible = true;
        gameCanvas.visible = true;
    }));
    engine.addEntity(numPadLock);

    //create a temporal wall
    const tempWall = new Entity();
    tempWall.addComponent(new PlaneShape());
    tempWall.addComponent(new Transform({position: new Vector3(19, 1.4, 13.1), scale: new Vector3(4,3,1)}));
    engine.addEntity(tempWall);

}