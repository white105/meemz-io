import './styles/app.css';
import React from 'react'
import { render } from 'react-dom'
import Core from './components/Core/index'
import SocketContext from './socket-context'
import io from 'socket.io-client'

const socket = io('/')

//root component
class App extends React.Component {

  render() {
    return (
      <div>
        <SocketContext.Provider value={socket}>
          <Core />
        </SocketContext.Provider>
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
