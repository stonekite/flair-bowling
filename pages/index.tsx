import React, { useCallback, useState } from "react"
import { css } from "@emotion/react"

import Frames, { Frame } from "../components/Frames"
import BallControls from "../components/BallControls"

const styles = css`
  display: initial;
`

const Home = () => {
  const [head, setHead] = useState(new Frame())

  const addBall = useCallback((score: number) => {
    head.addBall(score)
    if (head.isComplete && !head.isSessionComplete) {
      setHead(head.addNext())
    }
  }, [head])
  const restart = () => {
    setHead(new Frame())
  }

  return (
    <div className="App" css={ styles }>
      <Frames head={ head } />
      <BallControls
        isSessionComplete={ head.isSessionComplete }
        remainingPins={ head.remainingPins }
        onAddBall={ addBall }
        onRestart={ restart }
      />
    </div>
  )
}

export default Home
