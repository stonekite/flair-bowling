import { css } from "@emotion/react"
import { memo } from "react"

type props = {
  index: number,
  color: string,
  ball1: number | undefined,
  ball2: number | undefined,
  isBonus: boolean,
  isStrike: boolean,
  isSpare: boolean,
  cumulative: number
}

const styles = css`
  text-align: center;
  display: grid;
  grid-template-rows: repeat(2, 2em);
  line-height: 2em;
  grid-template-areas: 
    "i b1 b1 b2 b2"
    "c c c c c";
  grid-gap: 1px;
  > div {
    box-shadow: 0 0 2px #fff;
  }
`

const FrameComponent = ({
  index,
  color,
  ball1,
  ball2,
  isBonus,
  isStrike,
  isSpare,
  cumulative
}: props) => {
  return (
    <div
      css={ 
        css`
          ${ styles }
          background-color: ${ color };
        `
      }
    >
      <div css={ { gridArea: "i" } }>
        {
          index
        }
      </div>
      <div css={ { gridArea: "b1" } }>
        { 
          isStrike ? "X" :
          ball1
        }
      </div>
      <div css={ { gridArea: "b2" } }>
        {
          isStrike ? "" : 
          isSpare ? "/" :
          ball2
        }
      </div>
      <div css={ { gridArea: "c" } }>
        {
          isBonus ? "Bonus" :
          ball1 && cumulative
        }
      </div>
    </div>
  )
}

export default memo(FrameComponent)
