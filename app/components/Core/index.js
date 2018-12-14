import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import UserForm from '../UserForm/index'
import GameWithSocket from '../Game/index'
import LandingPage from '../LandingPage/index'
import Prompt from '../Prompt/index'
import MemeSelection from '../MemeSelection/index'

class Core extends React.Component {
  render() {
    return (
      <div className='outerRouterContainer'>
        <Router>
          <div className='innerRouterContainer'>
            <Route exact path='/' component={LandingPage} />
            <Route exact path="/game" component={GameWithSocket} />
            <Route path='/game/:id' component={GameWithSocket} />
            <Route exact path='/prompt' component={Prompt} />
            <Route exact path='/meme-selection' component={MemeSelection} />
          </div>
        </Router>
      </div>
    )
  }
}

export default Core
