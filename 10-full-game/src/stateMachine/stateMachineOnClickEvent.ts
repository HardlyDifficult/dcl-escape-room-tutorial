import { StateMachine } from "../modules/stateMachine";

/**
 * event for state machine when we click mouse or bubble
 */
export class StateMachineOnClickEvent implements StateMachine.IStateEvent {
  stateMachine: StateMachine;
  bubbleState: StateMachine.State;
  burstState: StateMachine.State;

  /**
   *
   * @param stateMachine state machine reference
   * @param bubbleState reference of the state for creating bubble
   * @param burstState reference of the state for bursting the bubble
   */
  constructor(
    stateMachine: StateMachine,
    bubbleState: StateMachine.State,
    burstState: StateMachine.State
  ) {
    this.stateMachine = stateMachine;
    this.bubbleState = bubbleState;
    this.burstState = burstState;
  }
}
