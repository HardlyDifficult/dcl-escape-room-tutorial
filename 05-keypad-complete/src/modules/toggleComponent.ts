export namespace ToggleComponent{
    export const enum State { Off = 0 , On }
}

/**
 * Toggle component for entities with two states (ON or OFF)
 */
@Component("toggle")
export class ToggleComponent{
    public enabled: boolean = true

    private onValueChangedCallback : (value: ToggleComponent.State) => void
    private state : ToggleComponent.State

    /**
     * Create an instance of a ToggleComponent
     * @param startingState starting state of the toggle (ON or OFF)
     * @param onValueChangedCallback called when toggle state changed
     */
    constructor(startingState: ToggleComponent.State = ToggleComponent.State.On, onValueChangedCallback : (value: ToggleComponent.State) => void = null){
        this.set(startingState)
        this.setCallback(onValueChangedCallback)
    }

    /**
     * Set trigger to a state
     * @param state new state
     */
    public set(state : ToggleComponent.State): void{
        this.state = state
        if (this.onValueChangedCallback)this.onValueChangedCallback(state)
    }

    /**
     * Toggle state of ToggleComponent
     */
    public toggle(): void{
        if (this.enabled){
            this.set(1-this.state)
        }
    }

    /**
     * Get if current toggle state is ON
     */
    public isOn(): boolean{
        return this.state == ToggleComponent.State.On
    }

    /**
     * Set callback for when ToggleComponent state changed
     * @param onValueChangedCallback callback
     */
    public setCallback(onValueChangedCallback : (value: ToggleComponent.State) => void): void{
        this.onValueChangedCallback = onValueChangedCallback
    }
}