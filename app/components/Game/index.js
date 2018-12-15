import React, { Component } from 'react';
import axios from 'axios'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import FontAwesome from 'react-fontawesome'
import MemeService from '../../services/MemeService/index'
import LeaderBoards from '../LeaderBoards/index'
import UserFormWithSocket from '../UserForm/index'
import SocketContext from '../../socket-context'

import MessagesWithSocket from '../Messages/index'

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enteredName: false,
      nickname: '',
      room_id: '',
      current_player_memes: [],
      current_players: [],
      captioned_img_url: '',
      top_caption: 'Take her on a date to taco bell',
      bottom_caption: 'Make her pay',
      isDealer: true,
      submitted_memes: [],
      didSubmit: false
    }

    this.memeService = new MemeService()

    this.generateMeme = this.generateMeme.bind(this)
    this.memeSelected = this.memeSelected.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.leftButtonClicked = this.leftButtonClicked.bind(this)
    this.rightButtonClicked = this.rightButtonClicked.bind(this)
    this.delear_submit_captions = this.delear_submit_captions.bind(this)
    this.submitMeme = this.submitMeme.bind(this)
    this.selectRoundWinner = this.selectRoundWinner.bind(this)


    this.toggle_dealer = this.toggle_dealer.bind(this)
    this.entered_name = this.entered_name.bind(this)
  }

  componentDidMount() {

    //console.log("document.cookie", document.cookie)

    //var cookies = document.cookie.split(';');

    var urlArray = window.location.href.split("/");
    var room_id = String(urlArray[urlArray.length - 1])

    const nickname = localStorage.getItem("nickname" + room_id)

    var connection = {
      room_id: room_id,
      nickname: nickname
    }

    this.props.socket.emit("room", connection);

    if (!!nickname) {
      this.setState({ nickname : nickname })
    }

    /*

    if (this.state.nickname != '' && this.state.room_id != '') {

      console.log("we here")
      var connection = {
        room_id: this.state.room_id,
        nickname: this.state.nickname
      }

      this.props.socket.emit("room", connection);
    }


    if (cookies[i].includes('nickname')) {
      var cookie_parts = cookies[i].split("=")
      console.log("cookie_parts", cookie_parts)
      this.setState({ nickname : String(cookie_parts[1]) })
      console.log('this.state.nickname', this.state.nickname)

    } else if (cookies[i].includes('room_id')) {
      var cookie_parts = cookies[i].split("=")
      var cookie_room_id = cookie[i]
      if (room_id != cookie_room_id) {
        console.log("room id != cookie id")
        var date = new Date();
        date.setTime(date.getTime());
        var expires = "; expires="+date.toGMTString();
        cookies[i].concat(expires);
      }
      //this.setState({ room_id : String(cookie_parts[1]) })
      console.log('this.state.room_id', cookie_parts[1])
    }
    */

    /*
    var open_userForm = false
    if (cookies.length > 0) {
      for (var i=0; i<cookies.length; i++) {
        if (cookies[i].includes('room_id')) {
          console.log("room id != cookie id")
          var cookie_parts = cookies[i].split("=")
          var cookie_room_id = cookie[i]
          if (cookie_room_id ! room_id) {
            var date = new Date();
            date.setTime(date.getTime());
            var expires = "; expires="+date.toGMTString();
            cookies[i].concat(expires);
          } else {
            console.log("else")
          }
        }
        console.log('this.state.room_id', cookie_parts[1])
      }
    }
    */



    axios.get('https://api.imgflip.com/get_memes')
      .then((response) => {
      let memes = response.data.data.memes
      this.props.socket.emit('memes_recieved_event', memes)
      //this.setState({ current_player_memes : memes })
    })
    .catch(function (error) {
      console.log(error);
    });

    this.props.socket.on('submitted_meme_url', meme_url => {
      this.setState({ submitted_memes : [meme_url, ...this.state.submitted_memes] })
    })


    this.props.socket.on('current_player_memes', memes => {
      this.setState({
        current_player_memes : memes
      })
    })
  }




  leftButtonClicked() {
    let my_hand = this.state.current_player_memes
    let last_card = my_hand[my_hand.length-1]

    /*do animations



    */

    my_hand.splice(my_hand.length-1, 1)
    my_hand.unshift(last_card)
    this.setState({ current_player_memes : my_hand })

    /*
    setTimeout(() => {
      my_hand.splice(my_hand.length-1, 1)
      my_hand.unshift(last_card)
      this.setState({ current_player_memes : my_hand })
    }, 1000);

    */


  }

  rightButtonClicked() {
    let my_hand = this.state.current_player_memes
    let first_card = my_hand[0]

    /*do animations



    */

    //shift occurs here

    setTimeout(() => {
      my_hand.shift()
      my_hand.push(first_card)
      this.setState({ current_player_memes : my_hand })
    }, 1000);
  }

  sendMessage() {
    const body = document.getElementById("messageInputTextField").value

    if (body != '') {
      const message = {
        body,
        from: 'Me'
      }

      this.setState({ messages : [message, ...this.state.messages], current_message: ''})
      this.props.socket.emit('message', body)
    }
  }

  memeSelected(meme_id) {
    let captions = document.getElementsByClassName("captionInstructions")
    captions[0].style.display = "None";
    captions[1].style.display = "None";

    let meme_site_username = 'username=nickwhite1423'
    let meme_site_password = 'password=memesrgreat1'

    // what we need
    let meme_template_id = "template_id=" + meme_id.toString()
    let top_caption = "text0=" + this.state.top_caption
    let bottom_caption = "text1=" + this.state.bottom_caption


    let caption_image_url = "https://api.imgflip.com/caption_image?" + meme_template_id + '&' + meme_site_username + '&' + meme_site_password + '&' + top_caption + '&' + bottom_caption

    axios.get(caption_image_url)
      .then((response) => {

        console.log("response.data", response.data.data)
        this.setState({ captioned_img_url : response.data.data.url })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  submitMeme() {
    if (!this.state.didSubmit) {
      let captioned_image_url = this.state.captioned_img_url
      console.log("this.state.submitted_memes", this.state.submitted_memes)
      this.setState({ submitted_memes : [captioned_image_url, ...this.state.submitted_memes] })
      console.log("this.state.submitted_memes", this.state.submitted_memes)
      this.props.socket.emit('submitted_meme_url', captioned_image_url)
      this.setState({ didSubmit : true })
    }
  }

  delear_submit_captions() {
    let top_caption = document.getElementById("topCaption").value
    let bottom_caption = document.getElementById("bottomCaption").value

    if (top_caption != '' || bottom_caption != '') {
      this.setState({top_caption : top_caption, bottom_caption : bottom_caption})
    }
  }

  selectRoundWinner() {
    console.log("You selected a winner!")
  }

  generateMeme(meme_data, position) {
    let meme_id = meme_data.id
    let meme_data_url = meme_data.url.toString()

    if (position == 1) {
      return ( <button key={meme_id} id='memePosition1' className='memeButtonIsVisible' onClick={() => this.memeSelected(meme_id)}><img src={meme_data_url} className='memeIsVisible' alt='n/a'/></button> )
    } else if (position == 2) {
      return ( <button key={meme_id} id='memePosition2' className='memeButtonIsVisible' onClick={() => this.memeSelected(meme_id)}><img src={meme_data_url} className='memeIsVisible' alt='n/a'/></button> )
    } else if (position == 3) {
      return ( <button key={meme_id} id='memePosition3' className='memeButtonIsVisible' onClick={() => this.memeSelected(meme_id)}><img src={meme_data_url} className='memeIsVisible' alt='n/a'/></button> )
    } else {
      return ( <button key={meme_id} className='memeButtonNotVisible' onClick={() => this.memeSelected(meme_id)}><img src={meme_data_url} className='memeNotVisible' alt='n/a'/></button> )
    }
  }

  toggle_dealer() {
    this.setState({ isDealer: !this.state.isDealer})
  }

  entered_name(nickname) {
    console.log("entered_name", nickname)
    this.setState({ nickname : nickname })
  }

    render() {

    let memes_arr = []

    if (this.state.current_player_memes.length > 0) {
      let memes = this.state.current_player_memes

      console.log('memes', memes)

      for(var i=0; i<memes.length; i++) {
        memes_arr.push(this.generateMeme(memes[i], i))
      }
    }

    let allContent = (memes_arr.length > 0) ? memes_arr.map(function(meme) { return meme } ) : null


    const submitted_memes = this.state.submitted_memes.map((meme_url, index) => {
      return <button className='submittedMemeButton' onClick={() => this.selectRoundWinner()}><img src={meme_url} key={index} className='submittedMeme' alt='n/a'/></button>
    })


    let userForm = (!this.state.nickname) ? <UserFormWithSocket entered_name={this.entered_name}></UserFormWithSocket> : undefined


    if (this.state.isDealer) {
      return (

        <div className='gameContainer'>
        {userForm}

        <div className='dealerContentContainer'>

          <div className='dealerContentTopContainer'>

            <button onClick={this.toggle_dealer}>Toggle Dealer</button>
            <div className='dealerInputDiv'>

              <div className='topCaptionContainer'>
                <h3 className='captionInputText'>Top Caption</h3>
                <input id='topCaption' type='text' placeholder='Enter top caption'></input>
              </div>

              <div className='bottomCaptionContainer'>
                <h3 className='captionInputText'>Bottom Caption</h3>
                <input id='bottomCaption' type='text' placeholder='Enter bottom caption'></input>
              </div>

              <div className='submitCaptionsButtonContainer'>
                <button onClick={this.delear_submit_captions} className='submitCaptionsButton'>submit</button>
              </div>

            </div>

            <div className='dealerSubmitVersion'>

              <div className='dealerSubmitImageContainer'>
                <img className='dealerCaptionedMeme' src={this.state.captioned_img_url} alt=''/>
                <div className='dealerCurrentCaptionsContainer'>
                  <h3 className='dealerCaptionInstructions'>Top caption : {this.state.top_caption}</h3>
                  <h3 id='num2baby' className='dealerCaptionInstructions'>Bottom caption : {this.state.bottom_caption}</h3>
                </div>
              </div>

            </div>

          </div>


          <div className='submittedMemesContainer'>
            {submitted_memes}
          </div>

        </div>

        <div className='sidebarContainer'>
          <LeaderBoards></LeaderBoards>
          <MessagesWithSocket></MessagesWithSocket>
        </div>

        </div>
      )
    } else {
      return (
        <div className='gameContainer'>
        {userForm}

        <div className='contentContainer'>

        <button onClick={this.toggle_dealer}>Toggle Dealer</button>

          <div className='gameTopContainer'>


            <div className='playerHand'>
              <button onClick={this.leftButtonClicked} id='arrowIconButtonLeft' className='arrowIconButton'><FontAwesome className='arrowIcon' name='arrow-left'/></button>
              {allContent}
              <button onClick={this.rightButtonClicked} id='arrowIconButtonRight' className='arrowIconButton'><FontAwesome className='arrowIcon' name='arrow-right'/></button>
            </div>
          </div>

          <div className='gameBottomContainer'>

          <div className='submitVersion'>

            <div className='submitImageContainer'>
              <img className='captionedMeme' src={this.state.captioned_img_url} alt=''/>
              <div className='currentCaptionsContainer'>
                <h3 className='captionInstructions'>Top caption : {this.state.top_caption}</h3>
                <h3 id='num2baby' className='captionInstructions'>Bottom caption : {this.state.bottom_caption}</h3>
              </div>
            </div>

            <div className='submitMemeButtonContainer'>
              <button className='submitMemeButton' onClick={this.submitMeme}>submit</button>
            </div>

          </div>

          <div className='playerInfoContainer'>
            <h3 className='topCaptionHeader'>Top Caption : {this.state.top_caption}</h3>
            <h3 className='bottomCaptionHeader'>Bottom Caption : {this.state.bottom_caption}</h3>
          </div>


          </div>

        </div>
          <div className='sidebarContainer'>
            <LeaderBoards></LeaderBoards>
            <MessagesWithSocket></MessagesWithSocket>
          </div>
        </div>
      )
    }
  }
}

const GameWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <Game {...props} socket={socket}></Game>}
  </SocketContext.Consumer>
)

export default GameWithSocket;
