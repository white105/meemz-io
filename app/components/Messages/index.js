import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome'
import SocketContext from '../../socket-context'

class Messages extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      current_message: '',
    }

    this.sendMessage = this.sendMessage.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }


  componentDidMount() {

    this.props.socket.on('message', message => {
      console.log("got a message!", message)
      console.log("this.state.messages")
      this.setState({ messages : [message, ...this.state.messages] })
    })

  }

  sendMessage() {
    const body = document.getElementById("messageInputTextField").value

    var urlArray = window.location.href.split("/");
    var gameId = String(urlArray[urlArray.length - 1])

    const nickname = localStorage.getItem("nickname" + gameId)

    if (body != '') {
      const send_message = {
        body: body,
        from: nickname,
        room_id: gameId
      }

      const receive_message = {
        body: body,
        from: "Me",
        room_id: gameId
      }

      this.setState({ messages : [receive_message, ...this.state.messages], current_message: ''})
      this.props.socket.emit('message', send_message)
    }
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {

    const messages = this.state.messages.map((message, index) => {
      if (message.from == 'Me') {
        return <div className='messageDivItem'><p id='meMessage' key={index} ><b>{message.from}</b>: {message.body}</p></div>
      } else {
        return <div className='messageDivItem'><p id='themMessage' key={index} ><b>{message.from}</b>: {message.body}</p></div>
      }
    })

    return (
      <div className='messagesContainer'>
        <h3 className='messagesTitle'>Messages<FontAwesome className='messageIcon' name='comments'/></h3>
        <div className='sendMessageContainer'>
          <input id='messageInputTextField' className='messageInputTextField' name='current_message' value={this.state.current_message} type='text' placeholder='Enter a message...' onChange={this.handleInputChange}/>
          <button className='sendMessageButton' onClick={this.sendMessage}>Send</button>
        </div>
        <div className='messagesDiv'>
          {messages}
        </div>
      </div>
    )
  }
}

const MessagesWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Messages {...props} socket={socket}></Messages>}
  </SocketContext.Consumer>
)

export default MessagesWithSocket;
