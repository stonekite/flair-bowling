import { css } from "@emotion/react"
import Controls from "./Controls"

type props = {
  onRestart: () => void,
  winningText: string
}

const styles = css`

`

const GameCompleteControls = ({ onRestart, winningText }: props) => {
  return (
    <Controls styles={ styles }>
      <>
        {
          winningText &&
          <h1>
            { winningText }
          </h1>
        }
        <h2>
          Thanks for playing Bowling with flair™!
        </h2>
        <button onClick={ onRestart }>
          Play again
        </button>
      </>
    </Controls>
  )
}

export default GameCompleteControls
