import CONFIG from 'constants/config';

const defaultOpts = {
  method: 'GET',
  headers: {
    'X-Gloo-Application': '60e5814d-9271-43b4-8540-157d1c743651',
    Accept: 'application/vnd.gloo.v2+json+consistent-format',
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  cache: 'default'
};

const fetcher = (method) => {
  return (uri, opts = {}) => {
    opts.headers = Object.assign({}, defaultOpts.headers, opts.headers);
    const fetchOpts = Object.assign({}, defaultOpts, opts, { method: method.toUpperCase() });
    if (fetchOpts.body) {
      fetchOpts.body = JSON.stringify(fetchOpts.body);
    }

    return fetch(`${CONFIG.server}/api/${uri}`, fetchOpts)
      .then((res) => {
        if (res.ok) {
          return parseJSON(res);
        } else {
          return Promise.reject(res);
        }
      });
  }
}

const parseJSON = (response) => {
  return response.text().then(function(text) {
    return text ? JSON.parse(text) : {}
  })
}

const service = {
  v1Header: {
    headers: {
      Accept: 'application/vnd.gloo.v1+json',
    }
  },
  get: fetcher('get'),
  post: fetcher('post'),
  patch: fetcher('patch'),
  delete: fetcher('delete'),
  setToken(token) {
    console.log('polymerApi.setToken(%o)',token);
    if (token) {
      defaultOpts.headers.Authorization = `Token ${token}`;
    } else {
      delete defaultOpts.headers.Authorization;
    }
    return defaultOpts.headers.Authorization;
  },
};


export default service;
