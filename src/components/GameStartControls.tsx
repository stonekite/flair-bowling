import { css } from "@emotion/react"
import Controls from "./Controls"

type props = {
  onStart: (nPlayers: number) => void
}

const styles = css`
  margin-top: 10em;
`

const GameStartControls = ({ onStart }: props) => {
  return (
    <Controls styles={ styles }>
      <>
        <h1>
          Welcome to Bowling with flair™!
        </h1>
        <h2>
          Please select the number of players:
        </h2>
        {
          [...Array(10)].map((_, i) => (
            <button onClick={ () => onStart(i + 1) } key={ i }>
              { i + 1 }
            </button>
          ))
        }
      </>
    </Controls>
  )
}

export default GameStartControls
