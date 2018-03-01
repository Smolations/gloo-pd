import React from 'react';
import {
  Route,
  Redirect,
} from 'react-router-dom';
import Session from '../../services/session';


const PrivateRoute = ({ component: Component, ...rest }) => {
  const componentProps = rest.componentProps || {};
  delete rest.componentProps;

  // originally, the <Component /> included {...props} but i removed it
  // because i thought it was causing a bug in the champ menu. i'll leave
  // it out for now since passing componentProps in tandem with scenes
  // defined using withRouter() seems more explicit.

  return (
    <Route
      {...rest}
      render = {props =>
        console.log('PrivateRoute rest/props:  %o/%o', rest, props) || !Session.session.isGuest ? (
          <Component {...componentProps} />
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
}

export default PrivateRoute;
