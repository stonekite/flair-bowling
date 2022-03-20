import { css } from "@emotion/react"
import { MAX_PINS } from "../constants"
import Controls from "./Controls"

const baseStyles = css`
  button {
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid #fff;
  }
  button:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`

type props = {
  onAddBall: (score: number) => void,
  remainingPins: number,
  mainText: string,
  subText: string
  colors: string[]
}

const BallControls = ({ onAddBall, remainingPins, mainText, subText, colors }: props) => {
  return (
    <Controls
      styles={
        css`
          ${ baseStyles }
          background: linear-gradient(90deg, ${ colors[0] } 0 90%, ${ colors[1] } 100%);
        `
      }
    >
      {
        <>
          <h1>
            { mainText }
          </h1>
          <h2>
            { subText }
          </h2>
          <div>
            {
              [...Array(remainingPins + 1)].map((_, i) => (
                <button
                  onClick={ () => onAddBall(i) }
                  key={ i }
                >
                  { i === MAX_PINS ? "X" :
                    i === remainingPins ? "/" :
                    i
                  }
                </button>
              ))
            }
          </div>
        </>
      }
    </Controls>
  )
}

export default BallControls
