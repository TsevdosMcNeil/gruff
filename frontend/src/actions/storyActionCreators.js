//Load posts
export const fetchStoriesBegin = () => ({
    type: 'FETCH_STORIES_BEGIN'
});

export const fetchStoriesSuccess = stories => ({
    type: 'FETCH_STORIES_SUCCESS',
    payload: stories
});

export const fetchStoriesError = error => ({
    type: 'FETCH_STORIES_FAILURE',
    payload: { error }
});

export function fetchStories() {
  return dispatch => {
    dispatch(fetchStoriesBegin());
    return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+'stories')
        .then(handleErrors)
        .then(response => response.json())
        .then(json => {
            dispatch(fetchStoriesSuccess(json));
        })
        .catch(error => dispatch(fetchStoriesError(error)));
    };
}
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
