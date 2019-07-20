export class Timer {
  protected time: number;
  protected timeElapsed: number;
  protected onTimerEnds: () => void;
  protected onTimerUpdate: (dt: number) => void;
  protected running: boolean;
  protected finished: boolean;

  constructor(
    seconds: number,
    onTimerEnds: () => void = null,
    onTimerUpdate: (dt: number) => void = null
  ) {
    this.time = seconds;
    this.setOnTimerEnds(onTimerEnds);
    this.setOnTimerUpdate(onTimerUpdate);
    this.reset();
  }

  public reset() {
    this.timeElapsed = 0;
    this.running = false;
    this.finished = false;
  }

  public updateTime(dt: number) {
    if (this.running) {
      this.timeElapsed = Scalar.Clamp(this.timeElapsed + dt, 0, this.time);
      if (this.onTimerUpdate) this.onTimerUpdate(dt);
      if (this.timeElapsed >= this.time) {
        if (this.onTimerEnds) this.onTimerEnds();
        this.running = false;
        this.finished = true;
      }
    }
  }

  public pause() {
    this.running = false;
  }

  public resume() {
    this.running = true;
  }

  public isRunning(): boolean {
    return this.running;
  }

  public hasFinished(): boolean {
    return this.finished;
  }

  public getTimeLeft(): number {
    return this.time - this.timeElapsed;
  }

  public getElapsedTime(): number {
    return this.timeElapsed;
  }

  public setOnTimerEnds(onTimerEnds: () => void): void {
    this.onTimerEnds = onTimerEnds;
  }

  public setOnTimerUpdate(onTimerUpdate: (dt: number) => void) {
    this.onTimerUpdate = onTimerUpdate;
  }
}

export class TimerSystem implements ISystem {
  private runningTimers: Timer[] = [];
  private removedTimers: number[] = [];

  private static _instance: TimerSystem = null;

  /**
   * Get singleton instance of TimerSystem
   */
  static get instance(): TimerSystem {
    if (TimerSystem._instance == null) {
      TimerSystem._instance = new TimerSystem();
      engine.addSystem(TimerSystem._instance);
    }
    return TimerSystem._instance;
  }

  private constructor() {}

  /**
   * Create and run a new timer
   * @param time amount of time in seconds
   * @param onTimerEnds callback for when timer ends
   */
  public createTimer(time: number, onTimerEnds: () => void): Timer {
    const timer = new Timer(time, onTimerEnds);
    this.runTimer(timer);
    return timer;
  }

  /**
   * Run an instance of a timer
   * @param timer instance of a timer
   */
  public runTimer(timer: Timer) {
    timer.reset();
    this.runningTimers.push(timer);
    timer.resume();
  }

  /**
   * Stop running timer
   * @param timer instance of a timer
   */
  public stop(timer: Timer) {
    for (let i = 0; i < this.runningTimers.length; i++) {
      if (timer == this.runningTimers[i]) {
        this.runningTimers.splice(i, 1);
        break;
      }
    }
  }

  update(dt: number) {
    for (let i = 0; i < this.runningTimers.length; i++) {
      const timer = this.runningTimers[i];
      timer.updateTime(dt);
      if (timer.hasFinished()) {
        this.removedTimers.push(i);
      }
    }
    for (let i = 0; i < this.removedTimers.length; i++) {
      this.runningTimers.splice(this.removedTimers.pop(), 1);
    }
  }
}
