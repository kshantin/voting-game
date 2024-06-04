import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Anounce from './views/anounce'
import Profile from './views/profile'
import Voting from './views/voting'
import Login from './views/login'
import Registr from './views/registr'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route component={Anounce} exact path="/anounce" />
        <Route component={Profile} exact path="/profile" />
        <Route component={Voting} exact path="/voting" />
        <Route component={Login} exact path="/" />
        <Route component={Registr} exact path="/registr" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
