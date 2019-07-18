export class StateMachine implements ISystem{
    private currentState: StateMachine.State

    /**
     * get current state
     */
    get state(): Readonly<StateMachine.State> {return this.currentState}

    /**
     * set a new state
     * @param state new state
     */
    setState(state: StateMachine.State){
        if (this.currentState != null){
            this.currentState.onKill()
        }
        this.currentState = state
        if (this.currentState != null){
            this.currentState.onStart()
        }
    }

    /**
     * handle a custom event
     * @param event event to handle
     */
    handleEvent(event: StateMachine.IStateEvent){
        if (this.currentState != null){
            this.currentState.onHandleEvent(event)
        }
    }

    update(dt: number){
        if (this.currentState != null){
            if (!this.currentState.onUpdateState(dt)){
                let temp = this.currentState
                this.currentState = null
                temp.onEnd()
                if (temp.nextState){
                    this.setState(temp.nextState)
                }
            }
        }
    }
}

export namespace StateMachine{
    export class State {
        /**
         * next state to start when this state is finished
         */
        nextState: State = null
        /**
         * called when state machine start this state.
         */
        onStart(): void {
        }
        /**
         * called when state machine updates this state.
         * return true if state is still active or false if state should finish
         * @param dt delta time
         */    
        onUpdateState(dt: number): boolean {
            return false
        }
        /**
         * called when state has finish
         */
        onEnd(): void {
        }
        /**
         * called when state machine kill this state to start another state
         */
        onKill(): void{
        }
        /**
         * handle event received by the state machine
         * @param event event received by the state machine
         */
        onHandleEvent(event: IStateEvent){
        }
    }

    export interface IStateEvent{
        /**
         * reference to the current state machine
         */
        stateMachine: StateMachine
    }
}