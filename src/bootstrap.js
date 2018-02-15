(function () {
  // EPOXY_CONFIG should be available
  // System should be available

  // grab any tokens passed in (allows integration of epoxy via native web
  // views and iframes). auth tokens are always paired with a specific
  // app token (a.k.a client key).
  var authToken = window.location.search.match(/authToken=([-0-9a-f]+)/);
  var appToken = window.location.search.match(/appToken=([-0-9a-f]+)/);
  var DEBUG_INFO_ENABLED = !!window.location.search.match(/(\?|&)debugInfoEnabled=true(&|$)/);
  var RENDER_CHROMELESS = (window.location.search.indexOf('renderChromeless') > -1);
  var RENDER_WEB_CHROMELESS = (window.location.search.indexOf('renderWebChromeless') > -1);

  var ENV = EPOXY_CONFIG.ENV;
  var FAVICONS_PATH = '/epoxy/assets/images/favicons/';
  var APP_TOKEN = (appToken ? appToken[1] : null); // acquired from bootstrap call
  var USER_TOKEN_KEY = 'Token';

  // fixes issue with older clients not stringifying tokens when storing them
  var USER_TOKEN = (authToken ? authToken[1] : null);
  if (!USER_TOKEN) {
    USER_TOKEN = store.get(USER_TOKEN_KEY);
  }

  // this is temporary until the sunset api is functional for the vast
  // majority of mobile users. as of the time of this change (06/02/17),
  // it is functional for android, and will be functional for the next ios
  // milestone build.
  if (isMobile() && RENDER_CHROMELESS && !(APP_TOKEN && USER_TOKEN)) {
    showMobileUpdateMsg();
    return;
  }

  var head = document.querySelector('head');
  var base = head.querySelector('base');
  var promise = getBootstrapData()
    .catch(function (errMsg) {
      console && console.error('Error fetching bootstrap data: %o', errMsg);
    });

  // set this again to make sure angular app gets the right token. localStorage
  // shim should already be initialized so should have cross-browser compatibility.
  store.set(USER_TOKEN_KEY, USER_TOKEN);


  // if we don't have a user token yet, greate a guest user and then bootstrap,
  // most likely resulting in a prompt to sign in. otherwise, use the found
  // token to bootstrap the app
  if (!USER_TOKEN) {
    promise = promise.then(createGuest);
  }

  // adds cache busting to systemjs (jspm module fetches)
  promise.then(function () {
    var systemLocate = System.locate;

    System.locate = function(load) {
      var System = this; // its good to ensure exact instance-binding
      return systemLocate.call(this, load)
        .then(function(address) {
          return address + System.cacheBust;
        });
    }
    System.cacheBust = '?bust=' + EPOXY_CONFIG.bootstrap.app_version;

    System.import(EPOXY_CONFIG.bootstrap.asset_path + '/app.module')
      .catch(function(e) {
        console && console.error('System import failed: %o', e);
      });
  });


  function createGuest() {
    return fetch(EPOXY_CONFIG.server + '/api/users/create_guest_user', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.gloo.v1+json',
        'Content-Type': 'application/json',
        'X-Gloo-Application': APP_TOKEN
      }
    })
    .then(parseJSON)
    .then(function (json) {
      USER_TOKEN = json.token.token;
      store.set(USER_TOKEN_KEY, USER_TOKEN);
    });
  }

  function getBootstrapData() {
    // one of the few non-auth endpoints
    return fetch(EPOXY_CONFIG.server + '/api/clients/bootstrap', {
      headers: {
        Accept: 'application/vnd.gloo.v2+json',
        'Content-Type': 'application/json',
        'X-Gloo-Application': APP_TOKEN
      }
    })
    .then(parseJSON)
    .then(function (json) {
      var faviconId = json.content.favicon_path;
      var googleTagManagerContainerId = json.content.google_tag_manager_container_id;

      APP_TOKEN = json.content.app_token;

      if (!ENV.spoofed && !EPOXY_CONFIG.server) {
        updateEnv(json.content.env);
      }

      EPOXY_CONFIG.bootstrap = json.content;
      EPOXY_CONFIG.bootstrap.debug_info_enabled = DEBUG_INFO_ENABLED;
      EPOXY_CONFIG.bootstrap.render_chromeless = RENDER_CHROMELESS;
      EPOXY_CONFIG.bootstrap.render_web_chromeless = RENDER_WEB_CHROMELESS;
      EPOXY_CONFIG.bootstrap.asset_path = (ENV.qa || ENV.production) ? '/epoxy/dist' : '/epoxy/app';

      // meta tags, so these will go first
      addIEStuff(faviconId);

      // manifest must be first link element in head
      addManifest(faviconId);
      addAppleIcons(faviconId);
      addBasicIcons(faviconId);

      if (ENV.production) {
        addGoogleTagManagerScript(googleTagManagerContainerId);
      }

      if (!ENV.production) {
        console && console.debug('EPOXY_CONFIG: %o', EPOXY_CONFIG);
      }

      return EPOXY_CONFIG.bootstrap;
    });
  }


  function createLinkElement(attrs) {
    var linkEl = document.createElement('link');
    var prop;

    for (prop in attrs) {
      linkEl.setAttribute(prop, attrs[prop]);
    }

    return linkEl;
  }

  function createMetaElement(attrs) {
    var linkEl = document.createElement('meta');
    var prop;

    for (prop in attrs) {
      linkEl.setAttribute(prop, attrs[prop]);
    }

    return linkEl;
  }

  function insertBeforeBase(node) {
    head.insertBefore(node, base);
  }

  function parseJSON(resp) {
    if (resp.status >= 400) {
      return Promise.reject(resp.statusText);
    }
    return resp.json();
  }
}());
