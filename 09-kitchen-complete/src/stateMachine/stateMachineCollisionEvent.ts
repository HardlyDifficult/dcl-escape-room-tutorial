import { StateMachine } from "../modules/stateMachine";

/**
 * event for state machine when a collision is triggered
 */
export class StateMachineCollisionEvent implements StateMachine.IStateEvent {
  static readonly PIKES = 0;
  static readonly BOXES = 1;
  static readonly FANS = 2;
  static readonly CAGE = 3;

  stateMachine: StateMachine;
  entity: Entity;
  triggerType: number;

  /**
   *
   * @param stateMachine state machine reference
   * @param entity reference of the entity we collide with
   * @param triggerType type of the trigger we collide with
   */
  constructor(stateMachine: StateMachine, entity: Entity, triggerType: number) {
    this.stateMachine = stateMachine;
    this.entity = entity;
    this.triggerType = triggerType;
  }
}
