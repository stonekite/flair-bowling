import FrameComponent from "./Frame"
import { Session } from "./classes"
import { css } from "@emotion/react"

const styles = css`
  font-size: 1.2em;
  max-width: 60em;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-column-gap: 0.5em;
  margin-bottom: 0.5em;
`

type props = {
  session: Session,
  color: string
}

const Frames = ({ session, color }: props) => {
  return (
    <div css={ styles }>
      {
        session.frames.map(({
          ball1,
          ball2,
          isBonus,
          isStrike,
          isSpare,
          cumulative
        }, i) => {
          return (
            <FrameComponent
              index={ i + 1 }
              color={ color }
              ball1={ ball1 }
              ball2={ ball2 }
              isBonus={ isBonus }
              isStrike={ isStrike }
              isSpare={ isSpare }
              cumulative={ cumulative }
              key={ i }
            />
          )
        })
      }
    </div>
  )
}

export default Frames
