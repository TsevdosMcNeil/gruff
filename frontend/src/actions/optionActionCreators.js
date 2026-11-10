//Load posts
export const fetchOptionsBegin = () => ({
    type: 'FETCH_OPTIONS_BEGIN'
});

export const fetchOptionsSuccess = options => ({
    type: 'FETCH_OPTIONS_SUCCESS',
    payload:options
});

export const fetchOptionsError = error => ({
    type: 'FETCH_OPTIONS_FAILURE',
    payload: { error }
});

export function fetchOptions() {
    return dispatch => {
      dispatch(fetchOptionsBegin());
      return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+'options')
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
          dispatch(fetchOptionsSuccess(json));
        })
        .catch(error => dispatch(fetchOptionsError(error)));
    };
  }
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }