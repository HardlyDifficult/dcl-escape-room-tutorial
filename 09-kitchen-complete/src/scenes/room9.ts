import {
  Door,
  Fan,
  KitchenTrigger,
  AnimatedModel,
  KitchenMouse,
  Bubble
} from "../gameObjects/index";
import resources from "../resources";
import utils from "../../node_modules/decentraland-ecs-utils/index";
import mouseMachine from "../modules/mouseStateMachine";
import { MouseComponent } from "../components/mouseWillComponent";
import { StateMachine } from "../modules/stateMachine";

export function CreateRoom9(): void {
  // Trigger Layers
  const MouseLayer = 8;
  const SpikesLayer = 16;
  const BoxLayer = 32;
  const FanLayer = 64;
  const CageLayer = 128;

  // Creating Kicthen Puzzle Model
  const kitchenModel = new AnimatedModel(
    resources.models.kitchenModel,
    { position: new Vector3(19.0928, 0, 28.6582) },
    new AnimationState("Spikes_Action", { looping: true })
  );
  kitchenModel
    .getComponent(Animator)
    .getClip("Spikes_Action")
    .play();

  // Creating Fans
  const fans: Fan[] = [
    new Fan(
      {
        position: new Vector3(-3.18875, 1.01502, -0.57951),
        rotation: Quaternion.Euler(0, 90, 0),
        scale: new Vector3(0.6, 0.6, 0.6)
      },
      kitchenModel,
      FanLayer
    ),
    new Fan(
      {
        position: new Vector3(-3.18875, 1.01502, 0.02),
        rotation: Quaternion.Euler(0, 90, 0),
        scale: new Vector3(0.6, 0.6, 0.6)
      },
      kitchenModel,
      FanLayer
    ),
    new Fan(
      {
        position: new Vector3(0.169518, 1.01502, -2.94794),
        scale: new Vector3(0.6, 0.6, 0.6),
        rotation: Quaternion.Identity
      },
      kitchenModel,
      FanLayer
    ),
    new Fan(
      {
        position: new Vector3(0.75203, 1.01502, -2.94794),
        scale: new Vector3(0.6, 0.6, 0.6),
        rotation: Quaternion.Identity
      },
      kitchenModel,
      FanLayer
    ),
    new Fan(
      {
        position: new Vector3(-0.873027, 1.01502, 3.0735),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.6, 0.6, 0.6)
      },
      kitchenModel,
      FanLayer
    ),
    new Fan(
      {
        position: new Vector3(1.9556, 1.01502, 1.08835),
        rotation: Quaternion.Euler(0, -90, 0),
        scale: new Vector3(0.6, 0.6, 0.6)
      },
      kitchenModel,
      FanLayer
    )
  ];

  // Setting some Fans on
  fans[0].getComponent(utils.ToggleComponent).toggle();
  fans[3].getComponent(utils.ToggleComponent).toggle();
  fans[4].getComponent(utils.ToggleComponent).toggle();

  // Creating Game Triggers
  const roomTriggers: KitchenTrigger[] = [
    new KitchenTrigger(
      new Vector3(0.52, 0.06, 0.52),
      new Vector3(0.212483, 1.15162, -0.04),
      SpikesLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.4, 0.52),
      new Vector3(-0.885757, 1.17605, -1.14666),
      SpikesLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.06, 0.52),
      new Vector3(-0.347696, 1.15162, -0.575279),
      SpikesLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.4, 0.52),
      new Vector3(0.729466, 1.17605, 1.08766),
      SpikesLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.06, 0.52),
      new Vector3(-0.347696, 1.15162, 1.08902),
      SpikesLayer,
      kitchenModel
    ),

    new KitchenTrigger(
      new Vector3(0.52, 0.16, 0.52),
      new Vector3(0.212483, 1.04742, -0.04),
      BoxLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.16, 0.52),
      new Vector3(-0.347696, 1.04742, -0.575279),
      BoxLayer,
      kitchenModel
    ),
    new KitchenTrigger(
      new Vector3(0.52, 0.16, 0.52),
      new Vector3(-0.347696, 1.04742, 1.08902),
      BoxLayer,
      kitchenModel
    )
  ];

  // Creating Cage Trigger
  const cageTrigger = new KitchenTrigger(
    new Vector3(0.52, 0.16, 0.52),
    new Vector3(1.0331, 1.04742, -0.04),
    CageLayer,
    kitchenModel
  );

  // Creating Hint Drawer
  const drawer = new AnimatedModel(
    resources.models.drawer,
    { position: new Vector3(20.5487, 0.563795, 28.6556) },
    new AnimationState("Drawer_Action", { looping: false })
  );

  // Creating Mouse
  const mouseEntity = new KitchenMouse(kitchenModel);
  const mouseComponent = mouseEntity.getComponent(MouseComponent);

  // Creating Bubble
  const bubble = new Bubble(
    { position: new Vector3(0, 0.2, 0.05) },
    mouseEntity
  );
  mouseEntity.getComponent(MouseComponent).bubble = bubble;

  // Adding StateMachine for Mouse
  const mouseStateMachine = new StateMachine();
  engine.addSystem(mouseStateMachine);

  // Creating Mouse States
  const mouseStateAppear = new mouseMachine.MouseStateAppear(mouseComponent);
  const mouseStateDie = new mouseMachine.MouseDeadState(mouseComponent);
  const mouseStateEnterCage = new mouseMachine.MouseEnterCageState(
    mouseComponent,
    (): void => {
      drawer
        .getComponent(Animator)
        .getClip("Drawer_Action")
        .play();
    }
  );

  const mouseStateWalking = new mouseMachine.MouseStateWalking(
    mouseComponent,
    mouseStateDie,
    mouseStateEnterCage
  );
  const mouseStateBurstBubble = new mouseMachine.MouseBurstBubbleState(
    mouseComponent
  );
  const mouseStateBubble = new mouseMachine.MouseBubbleState(
    mouseComponent,
    mouseStateBurstBubble
  );
  const mouseStateBubbleAppear = new mouseMachine.MouseBubbleStartState(
    mouseComponent,
    mouseStateBubble
  );
  const mouseStateFalling = new mouseMachine.MouseFallingState(
    mouseComponent,
    mouseStateDie
  );

  // Setting State Transitions
  mouseStateAppear.nextState = mouseStateWalking;
  mouseStateBurstBubble.nextState = mouseStateFalling;
  mouseStateFalling.nextState = mouseStateWalking;
  mouseStateDie.nextState = mouseStateAppear;

  // Setting Initial State
  mouseStateMachine.setState(mouseStateAppear);

  // Adding Trigger
  mouseEntity.addComponent(
    new utils.TriggerComponent(
      new utils.TriggerBoxShape(
        new Vector3(0.2, 0.1, 0.2),
        new Vector3(0, 0, 0)
      ),
      MouseLayer,
      SpikesLayer | BoxLayer | FanLayer | CageLayer,
      (entityEnter): void => {
        let triggerType = mouseMachine.StateMachineCollisionEvent.BOXES;
        const triggerLayer = entityEnter.getComponent(utils.TriggerComponent)
          .layer;

        if (triggerLayer == SpikesLayer) {
          triggerType = mouseMachine.StateMachineCollisionEvent.PIKES;
        } else if (triggerLayer == FanLayer) {
          triggerType = mouseMachine.StateMachineCollisionEvent.FANS;
        } else if (triggerLayer == CageLayer) {
          triggerType == mouseMachine.StateMachineCollisionEvent.CAGE;
        }

        mouseStateMachine.handleEvent(
          new mouseMachine.StateMachineCollisionEvent(
            mouseStateMachine,
            entityEnter,
            triggerType
          )
        );
      }
    )
  );

  // Adding Mouse OnClick Event
  mouseEntity.addComponent(
    new OnClick((): void => {
      mouseStateMachine.handleEvent(
        new mouseMachine.StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  // Adding Bubble OnClick Event
  bubble.addComponent(
    new OnClick((): void => {
      mouseStateMachine.handleEvent(
        new mouseMachine.StateMachineOnClickEvent(
          mouseStateMachine,
          mouseStateBubbleAppear,
          mouseStateBurstBubble
        )
      );
    })
  );

  // Creating Door
  const door = new Door(
    resources.models.door9,
    { position: new Vector3(23.2215, 0, 25.0522) },
    resources.sounds.doorSqueek
  );
  door.addComponent(
    new OnClick((): void => {
      if (!door.isOpen) {
        door.openDoor();
      }
    })
  );
}
