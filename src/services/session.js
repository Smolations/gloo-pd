import store from 'store';
import polymerApi from './polymer-api';

const v1Header = { headers: { Accept: 'application/vnd.gloo.v1+json', } }

const _session = {
  isGuest: null
};

const service = {
  get session() {
    return Object.assign({}, _session);
    // return _.clone(_session);
  },
  set session(val) {
    console.error('Session.session is read-only!');
  },

  authGuest: authGuest,
  authUser: authUser,
  destroy: destroy,
  getCurrentUser: getCurrentUser
};

// set any existing tokens.
// If a user token is seeded into the SPA view layout via `window`,
// the native client is proxy-ing requests via web view.
_setToken({
  token: window.currentUserToken || store.get('userToken') || null,
});


/**
 *  @returns Promise(_session)
 */
function authGuest() {
  return polymerApi.post('users/create_guest_user', v1Header)
    .then((resp) => {
      _session.isGuest = true;
      _setToken(resp.token);
      return service.session;
    });
}

/**
 *  @param {object} params An object containing a username and password.
 *  @returns promise(tokenObj)
 */
function authUser(params) {
  const opts = {
    body: Object.assign({}, params, { device_type: 'web' })
  };

  return polymerApi.post('sessions', Object.assign({}, opts, v1Header))
    .then((resp) => {
      _session.isGuest = false;
      return _setToken(resp.token);
    });
}

/**
 *  After destroying a session, creates a new guest user session so that
 *  login calls will succeed.
 *
 *  @returns promise(session)
 */
function destroy() {
  return polymerApi.delete('sessions', v1Header)
    .then(() => service.authGuest());
}

/**
 *  @returns promise(user)
 */
function getCurrentUser() {
  return polymerApi.get('sessions/current_user', v1Header)
    .then((resp) => {
      const user = resp.user;
      _setToken({
        token: _session.token,
        user_id: user.id,
        isGuest: (user.type === 'GuestUser'),
      });
      return user;
    });
}


/**
 *  @private
 *  pass `null` to unset
 *  @returns {Object} copy of _session
 */
function _setToken(tokenObj) {
  if (tokenObj === null) {
    tokenObj = {};
    Object.keys(_session).forEach((key) => { tokenObj[key] = null; });
    polymerApi.setToken(null);
    store.remove('userToken');
  } else {
    polymerApi.setToken(tokenObj.token);
    store.set('userToken', tokenObj.token);
  }

  Object.assign(_session, tokenObj);

  console.log('_setToken returning: %o', service.session);
  return service.session;
}

export default service;
