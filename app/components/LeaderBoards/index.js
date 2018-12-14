import React, { Component } from 'react';

class LeaderBoards extends Component {

  constructor() {
    super()
    this.state = {
      state: '',
      top_players: ['Nick White', 'Ed Ward', 'Jim Jones']
    }

    this.handleInputChange = this.handleInputChange.bind(this)
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
      <div className='leaderBoardContainer'>
        <div className='leaderboardTop'>
          <h1 id='leaderboardTitle'>LeaderBoard!</h1>
        </div>
        <div className='leaderBoard'>


          <div id='playerList'>
            <div className='playerContainer'>
              <h3 className='leaderBoardPlaceTitle'>First Place :</h3>
              <p className='player'>{this.state.top_players[0]}</p>
              <hr className='playerUnderline'></hr>
            </div>
            <div className='playerContainer'>
              <h3 className='leaderBoardPlaceTitle'>Second Place :</h3>
              <p className='player'>{this.state.top_players[1]}</p>
              <hr className='playerUnderline'></hr>
            </div>
            <div className='playerContainer' >
              <h3 className='leaderBoardPlaceTitle'>Third Place :</h3>
              <p className='player'>{this.state.top_players[2]}</p>
            </div>

          </div>

        </div>
      </div>
    )
  }
}

export default LeaderBoards;
