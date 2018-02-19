import React from 'react';
import ReactDOM from 'react-dom';
import store from 'store';

import './index.css';
import Project from './project';
import Session from 'services/session';


const storedToken = store.get('userToken');
let promise;

if (storedToken) {
  promise = Session.getCurrentUser()
    .catch(() => Session.authGuest())
    .then(user => console.warn(user));
} else {
  promise = Session.authGuest()
    .then(data => console.warn(data));
}



// ========================================

promise.then(() => {
  ReactDOM.render(
    <Project />,
    document.getElementById('root')
  );
})
