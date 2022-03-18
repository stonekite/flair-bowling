import React from "react"
import { css } from "@emotion/react"
import { MAX_PINS } from "./constants"

const styles = css`

`

type props = {
  isSessionComplete: boolean,
  remainingPins: number,
  onAddBall: (score: number) => void,
  onRestart: () => void
}

const BallControls = ({ isSessionComplete, remainingPins, onAddBall, onRestart }: props) => {
  return (
    <div css={ styles }>
      {
        !isSessionComplete ?
          <>
            <h2>
              Score
            </h2>
            <div>
              {
                [...Array(remainingPins + 1)].map((_, i) => (
                  i > 0 &&
                    <button
                      onClick={ () => onAddBall(i) }
                      key={ i }
                    >
                      { i === MAX_PINS ? "Strike" :
                        i === remainingPins ? "Spare" :
                        i
                      }
                    </button>
                ))
              }
            </div>
          </> :
          <>
            <h2>
              Session complete!
            </h2>
            <button onClick={ onRestart }>
              Play again
            </button>
          </>
      }
    </div>
  )
}

export default BallControls
