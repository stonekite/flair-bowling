import { css, SerializedStyles } from "@emotion/react"

type props = {
  children: React.ReactNode,
  styles?: SerializedStyles
}

const baseStyles = css`
  color: #fff;
  background-color: #203c86;
  font-size: 1.5em;
  width: 35em;
  margin: 2em auto 2em;
  padding: 1.5em;
  border-radius: 1em;
  text-align: center;

  button {
    color: #fff;
    background-color: #1388c9;
    font-size: 0.8em;
    padding: 0 1em;
    border: 0;
    min-height: 3em;
    min-width: 3em;
    border-radius: 1.5em;
    transition: background-color .25s ease-in-out;
  }
  button:not(:last-of-type) {
    margin-right: 0.5em;
  }
  button:hover {
    background-color: #dd691c;
    cursor: pointer;
  }
`

const Controls = ({ children, styles }: props) => {
  return (
    <div
      css={
        css`
          ${ baseStyles }
          ${ styles }
        `
      }
    >
      {
        children
      }
    </div>
  )
}

export default Controls
