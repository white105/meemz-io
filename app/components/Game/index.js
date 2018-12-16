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


const defaultState = {
  enteredName: false,
  nickname: '',
  room_id: '',
  client_id: '',
  cards: [],
  current_players: [],
  captioned_img_url: '',
  top_caption: 'Take her on a date to taco bell',
  bottom_caption: 'Make her pay',
  isDealer: false,
  submitted_memes: [],
  didSubmit: false,
  roundNumber: 1
}

class Game extends Component {

  constructor(props) {
    super(props)
    this.state = {
      enteredName: false,
      nickname: '',
      room_id: '',
      client_id: '',
      score: 0,
      cards: [],
      current_players: [],
      captioned_img_url: '',
      top_caption: 'Take her on a date to taco bell',
      bottom_caption: 'Make her pay',
      isDealer: false,
      submitted_memes: [],
      didSubmit: false,
      roundNumber: 1
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
    this.importantCode = this.importantCode.bind(this)
    this.generateSubmittedMeme = this.generateSubmittedMeme.bind(this)
  }

  importantCode() {

    this.setState(defaultState)
    var urlArray = window.location.href.split("/");
    var room_id = String(urlArray[urlArray.length - 1])
    const nickname = localStorage.getItem("nickname" + room_id)

    var connection = {
      room_id: room_id,
      nickname: nickname,

    }

    this.props.socket.emit("room", connection);
    this.props.socket.on('client_id', (client_id) => {

      console.log("Getting client back from server", client_id)
      //set client vars
      this.setState({
        client_id : client_id
      })
    })


    if (!!nickname) {
      this.setState({ nickname : nickname })
    }

    this.props.socket.on('captions', (captions) => {
      console.log("new captions")
      this.setState({
        top_caption : captions.top_caption,
        bottom_caption : captions.bottom_caption
       })
    })

    this.props.socket.on('dealer', bool => { this.setState({ isDealer : bool }) })

    this.props.socket.on('meme_submission', meme_submission => {

      console.log("recieved da event", meme_submission)
      /*

      structure of meme_submission

      var meme_submission = {
        captioned_meme : captioned_image_url,
        nickname: nickname,
        client_id : client_id
      }

      */
      this.setState({ submitted_memes : [meme_submission, ...this.state.submitted_memes] })

      console.log("this.state.submitted_memes", this.state.submitted_memes)
      console.log("typeof(this.state.submitted_memes)", typeof(this.state.submitted_memes))
    })


    this.props.socket.on('cards', cards => {
      this.setState({
        cards : cards
      })
    })
  }

  componentDidMount() {

    this.importantCode();


    this.props.socket.on('win', (client_id) => {
      if (this.state.client_id === client_id) {
        alert("You won!")
      } else {
        alert("You lost!")
      }
      this.importantCode();
    })


  }




  leftButtonClicked() {
    let my_hand = this.state.cards
    let last_card = my_hand[my_hand.length-1]

    //TODO: Smooth Card Animations
    my_hand.splice(my_hand.length-1, 1)
    my_hand.unshift(last_card)
    this.setState({ cards : my_hand })
  }

  rightButtonClicked() {
    let my_hand = this.state.cards
    let first_card = my_hand[0]

    //TODO: Smooth Card Animations
    my_hand.shift()
    my_hand.push(first_card)
    this.setState({ cards : my_hand })
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

    //meme_id will allow us to pick a winner correctly

    if (!this.state.didSubmit) {
      let captioned_image_url = this.state.captioned_img_url
      var meme_submission = {
        captioned_meme : captioned_image_url,
        nickname: this.state.nickname,
        client_id : this.state.client_id
      }

      console.log("meme_submission", meme_submission)
      this.setState({ submitted_memes : [captioned_image_url, ...this.state.submitted_memes] })
      console.log("this.state.submitted_memes", this.state.submitted_memes)


      this.props.socket.emit('meme_submission', meme_submission)
      this.setState({ didSubmit : true })
    }
  }

  delear_submit_captions() {
    let top_caption = document.getElementById("topCaption").value
    let bottom_caption = document.getElementById("bottomCaption").value

    var captions = {
      top_caption: top_caption,
      bottom_caption: bottom_caption
    }

    this.props.socket.emit('captions', captions)

    if (top_caption != '' || bottom_caption != '') {
      this.setState({top_caption : top_caption, bottom_caption : bottom_caption})
    }
  }

  selectRoundWinner(winner_client_id) {
    this.props.socket.emit('winner', winner_client_id)
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

  generateSubmittedMeme(meme_data, position) {
    return <button className='submittedMemeButton' onClick={() => this.selectRoundWinner(meme_data.client_id)}><img src={meme_data.captioned_meme} key={position} className='submittedMeme' alt='n/a'/></button>
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

    if (this.state.cards.length > 0) {
      let memes = this.state.cards

      for(var i=0; i<memes.length; i++) {
        memes_arr.push(this.generateMeme(memes[i], i))
      }
    }

    let allContent = (memes_arr.length > 0) ? memes_arr.map(function(meme) { return meme } ) : null

    let submittedMemes =  this.state.submitted_memes

      console.log('submittedMemes', submittedMemes)

    let submitted_memes_row1 = []
    let submitted_memes_row2 = []

    for (var i=0; i<submittedMemes.length; i++) {
      console.log('submittedMemes', submittedMemes[0])
      if (i <= 3) {
        submitted_memes_row1.push(this.generateSubmittedMeme(submittedMemes[i]))
      } else {
        submitted_memes_row2.push(this.generateSubmittedMeme(submittedMemes[i]))
      }
    }

    let row1_submitted_memes = (submitted_memes_row1.length > 0) ? submitted_memes_row1.map(function(submitted_meme) { return submitted_meme } ) : null
    let row2_submitted_memes = (submitted_memes_row2.length > 0) ? submitted_memes_row2.map(function(submitted_meme) { return submitted_meme } ) : null

    let userForm = (!this.state.nickname) ? <UserFormWithSocket entered_name={this.entered_name}></UserFormWithSocket> : undefined

    //<button onClick={this.toggle_dealer}>Toggle Dealer</button>  <button onClick={this.toggle_dealer}>Toggle Dealer</button>


    if (this.state.isDealer) {
      return (

        <div className='gameContainer'>
        {userForm}

        <div className='dealerContentContainer'>

          <div className='dealerContentTopContainer'>

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
            <div className='submittedMemesRow'>{row1_submitted_memes}</div>
            <div className='submittedMemesRow'>{row2_submitted_memes}</div>
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
