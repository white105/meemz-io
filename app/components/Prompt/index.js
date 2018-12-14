import React, { Component } from 'react';

class Prompt extends Component {

  constructor() {
    super()
    this.state = {

    }

  }

  render() {
    return (
      <div className='userForm'>
        <h3 className='inputTextTitle'>Prompt: Take Date to taco bell Make her Pay</h3>
        <button className='submitButton' onClick={this.submitPlayerName}>Done</button>
      </div>
    )
  }
}

export default Prompt;
