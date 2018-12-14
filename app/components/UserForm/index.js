import React, { Component } from 'react'
import MemeService from '../../services/MemeService'
import SocketContext from '../../socket-context'

class UserForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      player_name: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.submitPlayerName = this.submitPlayerName.bind(this)
    this.MemeService = new MemeService()
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  submitPlayerName() {

    var urlArray = window.location.href.split("/");
    var room_id = String(urlArray[urlArray.length - 1])
    let data = this.state.player_name
    var nickname = String(data).replace(/\s/g, "");

    var connection = {
      room_id: room_id,
      nickname: nickname
    }

    this.props.socket.emit("room", connection);

    var nickname_set = false;
    var room_id_set = false;

    if (cookies.length > 0) {
      for (var i=0; i<cookies.length; i++) {
        if (cookies[i].includes('nickname')) {
          nickname_set = true
        } else if (cookies[i].includes('room_id')) {
          room_id_set = true
        }
      }
    }

    if (!nickname_set) {
      document.cookie = `nickname=${nickname}`
    }

    if (room_id_set) {
      document.cookie = `room_id=${room_id}`
    }

    this.props.socket.on('add user', user => {
      this.setState({ messages : [message, ...this.state.messages] })
    })

    this.props.entered_name()

    this.MemeService.nameEntered()
  }

  render() {
    return (
      <div className='userFormContainer'>
        <div className='userForm'>
          <h3 className='inputTextTitle'>Enter your player name</h3>
          <input className='inputTextField' name='player_name' value={this.state.player_name} onChange={this.handleInputChange} type='text'></input>
          <button className='submitButton' onClick={this.submitPlayerName}>Submit</button>
        </div>
      </div>
    )
  }
}

const UserFormWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <UserForm {...props} socket={socket}></UserForm>}
  </SocketContext.Consumer>
)

export default UserFormWithSocket;
