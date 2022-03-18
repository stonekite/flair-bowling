import React from "react"
import { css } from "@emotion/react"
import { MAX_PINS, MAX_SESSION_LENGTH } from "../constants"

const sum = (array: number[]) => array.reduce((a, i) => a + i, 0)

export class Frame {
  private _balls: number[] = []
  public get ball1(): number {
    return this._balls?.[0]
  }
  public get ball2(): number {
    return this._balls?.[1]
  }

  public get isStrike(): boolean {
    return this.ball1 === MAX_PINS
  }
  public get isSpare(): boolean {
    return Boolean(this.ball1) && Boolean(this.ball2) && ((this.ball1 + this.ball2) === MAX_PINS)
  }
  public get isComplete(): boolean {
    return Boolean(
      this._balls.length === 2 
      || (this._balls.length === 1 && this.isStrike) 
      || (this.session.length === MAX_SESSION_LENGTH + 1 && this._prev?.isSpare && this._balls.length === 1)
    )
  }
  public addBall(n: number) {
    if (this.isComplete) {
      throw new RangeError(`You can't add more balls to this frame. # of balls: ${ this._balls.length }`)
    }

    this._balls.push(n)
  }

  public get remainingPins(): number {
    return MAX_PINS - sum(this._balls)
  }

  public get isSessionComplete(): boolean {
    let result = false
    const sessionLength = this.session.length

    if (sessionLength === MAX_SESSION_LENGTH) {
      result = !this.isStrike && !this.isSpare
    } else if (sessionLength === MAX_SESSION_LENGTH + 1) {
      result = this.isComplete
    }

    return result
  }

  private _prev?: Frame = undefined
  private _next?: Frame = undefined

  public addNext(): Frame {
    const newFrame = new Frame()
    this._next = newFrame
    newFrame._prev = this

    return newFrame
  }

  public get session(): Frame[] {
    const result: Frame[] = [this]
    let current: Frame = this

    while (current._prev) {
      result.unshift(current._prev)
      current = current._prev
    }

    return result
  }


  private _getNextBalls(n: number): number[] {
    const result: number[] = []
    let current: Frame = this

    while (current._next && result.length < n) {
      current = current._next
      result.concat(current._balls)
    }

    return result.slice(0, n)
  }
  public get score(): number {
    const balls = [...this._balls]

    if (this.isStrike) {
      balls.concat(this._getNextBalls(2))
    } else if (this.isSpare) {
      balls.concat(this._getNextBalls(1))
    }

    const result = sum(balls)
    return result
  }
  public get cumulative(): number | false {
    const result = sum(this.session.map(f => f.score))
    return result || false
  }
}

type props = {
  frame: Frame,
  index: number
}

const styles = css`

`

const FrameComponent = ({
  frame: {
    ball1,
    ball2,
    isStrike,
    isSpare,
    cumulative
  },
  index
}: props) => {
  return (
    <div css={ styles }>
      <div>
        {
          index
        }
      </div>
      <div>
        { 
          isStrike ? "X" :
          ball1
        }
      </div>
      <div>
        {
          isStrike ? "" : 
          isSpare ? "/" :
          ball2
        }
      </div>
      <div>
        {
          cumulative
        }
      </div>
    </div>
  )
}

const propsAreEqual = (prevProps: props, nextProps: props) => {
  const [prevFrame, nextFrame] = [prevProps.frame, nextProps.frame]
  const propertiesAreEqual = [
    prevFrame.ball1 === nextFrame.ball1,
    prevFrame.ball2 === nextFrame.ball2,
    prevFrame.score === nextFrame.score,
    prevFrame.cumulative === nextFrame.cumulative
  ]
  return propertiesAreEqual.every(p => p)
}

export default FrameComponent
