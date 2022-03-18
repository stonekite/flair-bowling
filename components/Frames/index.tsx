import React from "react"
import FrameComponent, { Frame } from "./Frame"
import { css } from "@emotion/react"

const styles = css`

`

type props = { head: Frame }

const Frames = ({ head }: props) => {
  return (
    <div css={ styles }>
      {
        head.session.map((frame, i) => (
          <FrameComponent
            frame={ frame }
            index={ i + 1 }
            key={ i }
          />
        ))
      }
    </div>
  )
}

export { Frame }
export default Frames
