//Load posts
export const fetchAwardsBegin = () => ({
    type: 'FETCH_AWARDS_BEGIN'
});

export const fetchAwardsSuccess = testimonial => ({
    type: 'FETCH_AWARDS_SUCCESS',
    payload: testimonial
});

export const fetchAwardsError = error => ({
    type: 'FETCH_AWARDS_FAILURE',
    payload: { error }
});

export function fetchAwards() {
  return dispatch => {
    dispatch(fetchAwardsBegin());
    return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+'awards')
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchAwardsSuccess(json));
      })
      .catch(error => dispatch(fetchAwardsError(error)));
  };
}
  
// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
