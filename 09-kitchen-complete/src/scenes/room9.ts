import utils from "../../node_modules/decentraland-ecs-utils/index";
import resources from "../resources";
import { StateMachine } from "../modules/stateMachine";
import { Door } from "../gameObjects/index";
import { StateMachineCollisionEvent } from "../stateMachine/stateMachineCollisionEvent";
import { StateMachineOnClickEvent } from "../stateMachine/stateMachineOnClickEvent";
import { MouseStateAppear } from "../stateMachine/mouseStateAppear";
import { MouseDeadState } from "../stateMachine/mouseDeadState";
import { MouseEnterCageState } from "../stateMachine/mouseEnterCageState";
import { MouseStateWalking } from "../stateMachine/mouseStateWalking";
import { MouseBurstBubbleState } from "../stateMachine/mouseBurstBubbleState";
import { MouseBubbleState } from "../stateMachine/mouseBubbleState";
import { MouseBubbleStartState } from "../stateMachine/mouseBubbleStartState";
import { MouseFallingState } from "../stateMachine/mouseFallingState";
import { MouseComponent } from "../components/mouseComponent";

//set trigger layers
const MouseLayer = 8;
const PikesLayer = 16;
const BoxLayer = 32;
const FanLayer = 64;
const CageLayer = 128;

export function CreateRoom9(): void {
  //create door entity
  const door = new Door(
    resources.models.door9,
    { position: new Vector3(23.2215, 0, 25.0522) },
    resources.sounds.doorSqueek
  );

  //listen to onclick event to toggle door state
  door.addComponent(
    new OnClick(() => {
      door.openDoor();
    })
  );

  //create drawer for hint
  const drawer = new Entity();
  const drawerClip = new AnimationState("Drawer_Action", { looping: false });
  const drawerAnimator = new Animator();
  drawerAnimator.addClip(drawerClip);
  drawer.addComponent(new GLTFShape("models/room9/Drawer.glb"));
  drawer.addComponent(
    new Transform({ position: new Vector3(20.5487, 0.563795, 28.6556) })
  );
  drawer.addComponent(drawerAnimator);
  engine.addEntity(drawer);

  //create room entity
  const roomEntity = new Entity();
  //add gltf shape
  roomEntity.addComponent(new GLTFShape("models/room9/Puzzle09_Game.glb"));
  //add and set transform
  roomEntity.addComponent(
    new Transform({ position: new Vector3(19.0928, 0, 28.6582) })
  );
  //create animator
  const roomAnimator = new Animator();
  //create animation state for room
  const roomAnimation = new AnimationState("Spikes_Action", { looping: true });
  //add clip to animator
  roomAnimator.addClip(roomAnimation);
  //add animator to entity
  roomEntity.addComponent(roomAnimator);
  //play animation
  roomAnimation.play();
  //add room to engine
  engine.addEntity(roomEntity);

  //create mouse
  const mouseEntity = new Entity("mouse");
  //set mouse as child of room
  mouseEntity.setParent(roomEntity);
  //add gltf
  mouseEntity.addComponent(
    new GLTFShape("models/room9/Puzzle09_MouseWill.glb")
  );
  //create and add transform
  const mouseTransform = new Transform();
  mouseEntity.addComponent(mouseTransform);
  //create and add mouse component
  const mouseComponent = new MouseComponent(mouseEntity);
  mouseEntity.addComponent(mouseComponent);

  //create state machine
  const mouseStateMachine = new StateMachine();
  engine.addSystem(mouseStateMachine);

  //add trigger for mouse
  mouseEntity.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.2, 0.1, 0.2),
        new Vector3(0, 0, 0)
      ),
      MouseLayer,
      PikesLayer | BoxLayer | FanLayer | CageLayer,
      entityEnter => {
        let triggerType = StateMachineCollisionEvent.BOXES;
        const triggerLayer = entityEnter.getComponent(utils.TriggerComponent)
          .layer;
        if (triggerLayer == PikesLayer) {
          triggerType = StateMachineCollisionEvent.PIKES;
        } else if (triggerLayer == FanLayer) {
          triggerType = StateMachineCollisionEvent.FANS;
        } else if (triggerLayer == CageLayer) {
          triggerType = StateMachineCollisionEvent.CAGE;
        }
        mouseStateMachine.handleEvent(
          new StateMachineCollisionEvent(
            mouseStateMachine,
            entityEnter,
            triggerType
          )
        );
      }
    )
  );

  //create mouse states
  //state for mouse appearing when game start
  const mouseStateAppear = new MouseStateAppear(mouseComponent);
  //state for when mouse died
  const mouseStateDie = new MouseDeadState(mouseComponent);
  //state for mouse entering the cage
  const mouseStateEnterCage = new MouseEnterCageState(mouseComponent, () => {
    drawerClip.play();
  });
  //state for mouse walking
  const mouseStateWalking = new MouseStateWalking(
    mouseComponent,
    mouseStateDie,
    mouseStateEnterCage
  );
  //state for bursting bubble
  const mouseStateBurstBubble = new MouseBurstBubbleState(mouseComponent);
  //state for mouse floating inside bubble
  const mouseStateBubble = new MouseBubbleState(
    mouseComponent,
    mouseStateBurstBubble
  );
  //state for bubble appearing and going up
  const mouseStateBubbleAppear = new MouseBubbleStartState(
    mouseComponent,
    mouseStateBubble
  );
  //state for mouse falling to the ground
  const mouseStateFalling = new MouseFallingState(
    mouseComponent,
    mouseStateDie
  );

  //listen for click on mouse
  mouseEntity.addComponent(
    new OnClick(event => {
      mouseStateMachine.handleEvent(
        new StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  //create bubble entity
  const bubbleEntity = new Entity();
  //add transform
  bubbleEntity.addComponent(
    new Transform({ position: new Vector3(0, 0.1, 0.05) })
  );
  //create shape and add it as component
  const bubbleShape = new SphereShape();
  bubbleEntity.addComponent(bubbleShape);
  //set it as invisible
  bubbleShape.visible = false;
  //create bubble material
  const bubbleMaterial = new Material();
  bubbleMaterial.albedoTexture = new Texture("images/room9/bubbleTexture.png", {
    hasAlpha: false
  });
  bubbleMaterial.hasAlpha = true;
  bubbleMaterial.alpha = 0.5;
  //add bubble material
  bubbleEntity.addComponent(bubbleMaterial);
  //set bubble as child of mouse
  bubbleEntity.setParent(mouseEntity);
  //set bubble to mouseComponent
  mouseComponent.bubble = bubbleEntity;

  //listen for click on bubble
  bubbleEntity.addComponent(
    new OnClick(event => {
      mouseStateMachine.handleEvent(
        new StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  //what states should automatically start when a state ends
  mouseStateAppear.nextState = mouseStateWalking;
  mouseStateBurstBubble.nextState = mouseStateFalling;
  mouseStateFalling.nextState = mouseStateWalking;
  mouseStateDie.nextState = mouseStateAppear;

  //set initial state
  mouseStateMachine.setState(mouseStateAppear);

  //load fan audio clio
  const audioClipFan = new AudioClip("sounds/fan.mp3");

  //create fan shape
  const fanShape = new GLTFShape("models/room9/Fan.glb");

  //create fan entities array
  const fans: Entity[] = [];

  //create fans transfrom
  const fansTransform: Transform[] = [
    new Transform({
      position: new Vector3(-3.18875, 1.01502, -0.57951),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.6, 0.6, 0.6)
    }),
    new Transform({
      position: new Vector3(-3.18875, 1.01502, 0.02),
      rotation: Quaternion.Euler(0, 90, 0),
      scale: new Vector3(0.6, 0.6, 0.6)
    }),
    new Transform({
      position: new Vector3(0.169518, 1.01502, -2.94794),
      scale: new Vector3(0.6, 0.6, 0.6)
    }),
    new Transform({
      position: new Vector3(0.75203, 1.01502, -2.94794),
      scale: new Vector3(0.6, 0.6, 0.6)
    }),
    new Transform({
      position: new Vector3(-0.873027, 1.01502, 3.0735),
      rotation: Quaternion.Euler(0, 180, 0),
      scale: new Vector3(0.6, 0.6, 0.6)
    }),
    new Transform({
      position: new Vector3(1.9556, 1.01502, 1.08835),
      rotation: Quaternion.Euler(0, -90, 0),
      scale: new Vector3(0.6, 0.6, 0.6)
    })
  ];

  fansTransform.forEach(transform => {
    //instantiate animation
    const fanAnimation = new AnimationState("Fan_Action", { looping: true });
    //create animator
    const fanAnimator = new Animator();
    //add clip to animator
    fanAnimator.addClip(fanAnimation);
    //create entity
    const fanEntity = new Entity();
    //add shape
    fanEntity.addComponent(fanShape);
    //add animator
    fanEntity.addComponent(fanAnimator);
    //add transform
    fanEntity.addComponent(transform);
    //add audio source
    fanEntity.addComponent(new AudioSource(audioClipFan));
    //set room as parent
    fanEntity.setParent(roomEntity);

    //calc trigger size and position
    const triggerSize = new Vector3(0.5, 0.5, 2.25).rotate(transform.rotation);
    triggerSize.x = Math.abs(triggerSize.x);
    triggerSize.y = Math.abs(triggerSize.y);
    triggerSize.z = Math.abs(triggerSize.z);
    const triggerPosition = new Vector3(0.2, 0.65, 1.35).rotate(
      transform.rotation
    );

    //create trigger component
    const triggerComponent = new utils.TriggerComponent(
      new utils.TriggerBoxShape(triggerSize, triggerPosition),
      FanLayer
    );
    triggerComponent.enabled = false;
    fanEntity.addComponent(triggerComponent);

    //add toggle component
    fanEntity.addComponent(
      new utils.ToggleComponent(utils.ToggleState.Off, newValue => {
        if (newValue == utils.ToggleState.On) {
          fanAnimation.play();
          fanEntity.getComponent(AudioSource).playing = true;
          fanEntity.getComponent(AudioSource).loop = true;
          fanEntity.getComponent(AudioSource).volume = 0.3;
          triggerComponent.enabled = true;
        } else {
          fanEntity.getComponent(AudioSource).playing = false;
          fanAnimation.stop();
          triggerComponent.enabled = false;
        }
      })
    );
    //listen for click
    fanEntity.addComponent(
      new OnClick((): void => {
        fanEntity.getComponent(utils.ToggleComponent).toggle();
      })
    );

    //add entity to array
    fans.push(fanEntity);
  });

  //set some fans to ON state
  fans[0].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  fans[3].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);
  fans[4].getComponent(utils.ToggleComponent).set(utils.ToggleState.On);

  //room triggers
  const roomTriggerEntities: Entity[] = [
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity(),
    new Entity()
  ];

  //create pikes' triggers
  roomTriggerEntities[0].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(0.212483, 1.15162, -0.04)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[1].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.4, 0.52),
        new Vector3(-0.885757, 1.17605, -1.14666)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[2].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(-0.347696, 1.15162, -0.575279)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[3].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.4, 0.52),
        new Vector3(0.729466, 1.17605, 1.08766)
      ),
      PikesLayer
    )
  );
  roomTriggerEntities[4].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.06, 0.52),
        new Vector3(-0.347696, 1.15162, 1.08902)
      ),
      PikesLayer
    )
  );

  //create boxes's triggers
  roomTriggerEntities[5].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(0.212483, 1.04742, -0.04)
      ),
      BoxLayer
    )
  );
  roomTriggerEntities[6].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(-0.347696, 1.04742, -0.575279)
      ),
      BoxLayer
    )
  );
  roomTriggerEntities[7].addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(-0.347696, 1.04742, 1.08902)
      ),
      BoxLayer
    )
  );

  //create cage's trigger
  const cageTrigger = new Entity();
  cageTrigger.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.52, 0.16, 0.52),
        new Vector3(1.0331, 1.04742, -0.04)
      ),
      CageLayer
    )
  );
  cageTrigger.setParent(roomEntity);

  //set triggers as child of room entity
  roomTriggerEntities.forEach(triggerEntity => {
    triggerEntity.setParent(roomEntity);
  });
}
