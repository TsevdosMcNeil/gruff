//Load posts
export const fetchPeopleBegin = () => ({
    type: 'FETCH_PEOPLE_BEGIN'
});

export const fetchPeopleSuccess = people => ({
    type: 'FETCH_PEOPLE_SUCCESS',
    payload: people
});

export const fetchPeopleError = error => ({
    type: 'FETCH_PEOPLE_FAILURE',
    payload: { error }
});

export function fetchPeople() {
  return dispatch => {
    dispatch(fetchPeopleBegin());
    return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+'people')
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchPeopleSuccess(json));
      })
      .catch(error => dispatch(fetchPeopleError(error)));
  };
}
  
// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
