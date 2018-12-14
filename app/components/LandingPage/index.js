import React, { Component } from 'react';
import MemeService from '../../services/MemeService'

class LandingPage extends Component {

  constructor() {
    super()
    this.state = {
      state: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.startNewPublicGame = this.startNewPublicGame.bind(this)
    this.startNewPrivateGame = this.startNewPrivateGame.bind(this)

    this.memeService = new MemeService()
  }

  startNewPublicGame() {
    console.log("New public game!")

    //this.memeService.startNewPublicGame()
  }

  startNewPrivateGame() {
    console.log("New private game!")

    this.memeService.startNewPrivateGame()
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
    return (
      <div className='landingPageContainer'>
        <div className='landingPageMainContainer'>
          <img id='meemzLogo' src='../../assets/meemz.io-logo.png'></img>
          <div className='aboutGameGontainer'>
            <p className='aboutParagraph'>meemz.io is a free online browser game designed for friends to play together</p>
            <p className='aboutParagraph'>join either a public game with strangers or host a private game with your friends by selecting one of the two buttons below!</p>
          </div>
          <div className='newGameContainer'>
            <button className='startGameButton' onClick={this.startNewPublicGame}>Start New Public Game</button>
            <button className='startGameButton' onClick={this.startNewPrivateGame}>Start New Private Game</button>
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage;
