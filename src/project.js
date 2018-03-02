import React from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppNav from 'components/AppNav';

import Cohorts from './scenes/Cohorts';
import Home from './scenes/Home';
import Login from './scenes/Login';
import PrivateRoute from 'components/PrivateRoute';


// smola jr:  441201

export default class Project extends React.Component {
  state = {
    currentChampion: { id: 0 },
  };

  render() {
    console.warn('Project render()');
    return (
      <MuiThemeProvider>
        <Router>
          <main>
            <AppNav onChampionSelect={this.handleChampionSelect} />
            <section id="routeContainer">
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <PrivateRoute path="/cohorts" component={Cohorts} componentProps={{ championId: this.state.currentChampion.id }} />
            </section>
          </main>
        </Router>
      </MuiThemeProvider>
    );
  }

  handleChampionSelect = (currentChampion) => {
    this.setState({ currentChampion });
  }
};
