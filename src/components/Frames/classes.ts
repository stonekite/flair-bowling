
import { MAX_PINS, MAX_SESSION_LENGTH } from "../../constants"

const sum = (array: number[]) => array.reduce((a, i) => a + i, 0)

export class Frame {
  public constructor(balls: number[], session: Session, isBonus: boolean = false) {
    this._balls = balls
    this._session = session
    this._isBonus = isBonus
  }

  private _balls: number[]
  private _session: Session
  private _isBonus: boolean // i.e. frame is after MAX_SESSION_LENGTH

  public setSession(session: Session) {
    this._session = session
  }

  public withNewBall(score: number): Frame {
    if (this.isComplete) {
      throw new RangeError("You can't add more balls to this frame.")
    }

    return new Frame([...this._balls, score], this._session, this._isBonus)
  }

  public get length(): number {
    return this._balls.length
  }

  public get ball1(): number | undefined {
    return this._balls?.[0]
  }

  public get ball2(): number | undefined {
    return this._balls?.[1]
  }

  public get isStrike(): boolean {
    return this.ball1 === MAX_PINS
  }

  public get isBonus(): boolean {
    return this._isBonus
  }

  public get isSpare(): boolean {
    return Boolean(this.ball1) && Boolean(this.ball2) && (this.remainingPins === 0)
  }

  public get isComplete(): boolean {
    const prev = this._session.getPrevFrame(this)
    return Boolean(
      this._balls.length === 2
      // rules concerning strikes
      || (this._balls.length === 1 && this.isStrike)
      // MAX_SESSION_LENGTH + 2 only reachable with strikes on MAX_SESSION_LENGTH and MAX_SESSION_LENGTH + 1
      || (this._balls.length === 1 && this._session.length === MAX_SESSION_LENGTH + 2)
      // rules concerning spares
      || (this._balls.length === 1 && this._isBonus && prev?.isSpare)
    )
  }

  public get remainingPins(): number {
    return MAX_PINS - sum(this._balls)
  }

  public get score(): number | undefined {
    let balls = [...this._balls]

    const n = this.isStrike ? 2 : this.isSpare ? 1 : 0
    const nextFrames = this._session.getNextFrames(this, n)
    const nextBalls = nextFrames.map(f => f._balls).flat().slice(0, n)

    const result = sum([...balls, ...nextBalls])
    return result || undefined
  }

  public get cumulative(): number {
    const prev = this._session.getPrevFrame(this)
    return (prev?.cumulative || 0) + (this.score || 0)
  }
}

export class Session {
  public constructor(frames: Frame[] | number[][] = [[]]) {
    this._frames = frames.map(f => f instanceof Frame ? f : new Frame(f, this))
    this._frames.forEach(f => f.setSession(this))
  }

  private _frames: Frame[]

  public get frames() {
    return this._frames
  }

  public get length(): number {
    return this._frames.length
  }

  public get score(): number {
    const frames = [...this._frames]
    frames.reverse()
    return frames.find(f => !f.isBonus)?.cumulative || 0
  }

  public get latestFrame(): Frame {
    return this._frames[this.length - 1]
  }

  public get isComplete(): boolean {
    return this.latestFrame.isComplete
  }

  // i.e. does the session end after latest frame is complete
  private get _isOnLastFrame(): boolean {
    const prevFrame = this.getPrevFrame(this.latestFrame)
    return (
      this.length === MAX_SESSION_LENGTH + 2
      || this.length === MAX_SESSION_LENGTH + 1 && (!prevFrame?.isStrike)
      || this.length === MAX_SESSION_LENGTH + 1 && (this.latestFrame.length > 1)
      || this.length === MAX_SESSION_LENGTH && (!this.latestFrame.isStrike && !this.latestFrame.isSpare)
    )
  }

  public withNewBall(score: number): Session {
    const newFrames = [
      ...this._frames.slice(0, this.length - 1),
      this.latestFrame.withNewBall(score)
    ]

    let result = new Session(newFrames)

    if (result.latestFrame.isComplete && !result._isOnLastFrame) {
      const isBonus = result.length > 9
      newFrames.push(new Frame([], result, isBonus))
    }

    result = new Session(newFrames)

    return result
  }

  public getPrevFrame(frame: Frame): Frame | undefined {
    const i = this._frames.indexOf(frame)
    return this._frames?.[i - 1]
  }

  public getNextFrames(frame: Frame, n: number): Frame[] {
    const i = this._frames.indexOf(frame)
    return this._frames.slice(i + 1, i + n + 1)
  }
}
