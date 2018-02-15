import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import Session from '../../services/session';


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !Session.session.isGuest ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
