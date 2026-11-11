//Load posts
export const fetchProjectsBegin = () => ({
    type: 'FETCH_PROJECTS_BEGIN'
});

export const fetchProjectsSuccess = projects => ({
    type: 'FETCH_PROJECTS_SUCCESS',
    payload: projects
});

export const fetchProjectsError = error => ({
    type: 'FETCH_PROJECTS_FAILURE',
    payload: { error }
});

export function fetchProjects(slug = '') {
  return dispatch => {
    dispatch(fetchProjectsBegin());
    return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+'projects')
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchProjectsSuccess(json));
      })
      .catch(error => dispatch(fetchProjectsError(error)));
  };
}
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }
