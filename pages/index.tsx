import { useCallback, useMemo, useState } from "react"
import { css } from "@emotion/react"

import Frames from "../src/components/Frames"
import BallControls from "../src/components/BallControls"
import GameCompleteControls from "../src/components/GameCompleteControls"
import { Session } from "../src/components/Frames/classes"
import GameStartControls from "../src/components/GameStartControls"

const styles = css`
`

const colors = [
  "#203c86",
  "#cc5f17",
  "#1c8328",
  "#ab1a2b",
  "#7638bc",
  "#7c3c38",
  "#d447ba",
  "#815156",
  "#9a9a23",
  "#0e94b2"
]

const Home = () => {
  const [sessions, setSessions] = useState<Session[]>([new Session([[]])])
  const [currentSessionIndex, setCurrentSessionIndex] = useState<number>(0)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  const getPlayerName = useCallback((i: number): string => (
    sessions.length > 1 ? `Player ${ i + 1 }` : "you"
  ), [sessions])

  const getColor = useCallback((i: number = 0): string => {
    return colors[i % Math.min(colors.length, sessions.length)]
  }, [sessions, currentSessionIndex])

  const getNextSessionIndex = useCallback((): number => (
    currentSessionIndex < sessions.length - 1 ? currentSessionIndex + 1 : 0
  ), [sessions, currentSessionIndex])

  const getWinningText = useCallback((): string => {
    const max = Math.max(...sessions.map(s => s.score))
    const i = sessions.findIndex(s => max === s.score)
    if (sessions.length > 1) {
      return `${ getPlayerName(i) } wins with a score of ${ max }. Congratulations!`
    } else {
      return `You scored ${ max }. Congratulations!`
    }
  }, [sessions, getPlayerName])

  const startGame = (nPlayers: number) => {
    setSessions([...Array(nPlayers)].map(_ => new Session([[]])))
    setCurrentSessionIndex(0)
    setIsGameStarted(true)
  }

  const addBall = useCallback((score: number) => {
    const oldLength = sessions[currentSessionIndex].length
    const newSession = sessions[currentSessionIndex].withNewBall(score)
    setSessions([
      ...sessions.slice(0, currentSessionIndex),
      newSession,
      ...sessions.slice(currentSessionIndex + 1)
    ])
    if (sessions.length > 1 && (newSession.length > oldLength || newSession.isComplete)) {
      let i: number
      // NB: assignment in conditional
      if ((i = sessions.slice(currentSessionIndex + 1).findIndex(s => !s.isComplete)) > -1) {
        setCurrentSessionIndex(i + currentSessionIndex + 1)
      } else if ((i = sessions.slice(0, currentSessionIndex).findIndex(s => !s.isComplete)) > -1) {
        setCurrentSessionIndex(i)
      }
    }
  }, [sessions, currentSessionIndex, getNextSessionIndex])

  const restartGame = () => {
    setIsGameStarted(false)
  }

  const isGameComplete: boolean = useMemo(() => (
    sessions.every(s => s.isComplete)
  ), [sessions])

  const gameText: string[] = useMemo(() => {
    const frameIndex = sessions[currentSessionIndex].length
    const ballIndex = sessions[currentSessionIndex].latestFrame.length + 1
    const playerName = getPlayerName(currentSessionIndex)
    let mainText = `Frame #${ frameIndex }, ball #${ ballIndex }`
    if (sessions.length > 1) {
      mainText += ` for ${ playerName }`
    }
    const subText = sessions.length > 1 ? "They scored" : "You scored"
    return [mainText, subText]
  }, [sessions, currentSessionIndex, getPlayerName])

  return (
    <div className="App" css={ styles }>
      <a
        css={
          css`
            color: #aaa !important;
            display: block;
            text-align: center;
          `
        }
        href="https://github.com/stonekite/flair-bowling"
        target="_blank"
        rel="noreferrer"
      >
        https://github.com/stonekite/flair-bowling
      </a>
      {
        isGameStarted ?
          isGameComplete ?
            <GameCompleteControls
              onRestart={ restartGame }
              winningText={ getWinningText() }
            /> :
            <BallControls
              onAddBall={ addBall }
              remainingPins={ sessions[currentSessionIndex].latestFrame.remainingPins }
              mainText={ gameText[0] }
              subText={ gameText[1] }
              colors={
                [
                  getColor(currentSessionIndex),
                  getColor(currentSessionIndex + 1)
                ]
              }
            /> :
          <GameStartControls
            onStart={ startGame }
          />
      }
      {
        isGameStarted &&
        sessions.map((session, i) => (
          <Frames
            session={ session }
            color={ getColor(i) }
            key={ i }
          />
        ))
      }
    </div>
  )
}

export default Home
