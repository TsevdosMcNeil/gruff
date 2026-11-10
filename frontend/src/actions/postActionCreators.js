//Load posts
export const fetchPostsBegin = () => ({
    type: 'FETCH_POST_BEGIN'
});

export const fetchPostsSuccess = posts => ({
    type: 'FETCH_POSTS_SUCCESS',
    payload: { type:posts.type,data:posts.data }
});

export const fetchPostsError = error => ({
    type: 'FETCH_POSTS_FAILURE',
    payload: { error }
});

export function fetchPosts(post_type) {
    return dispatch => {
      dispatch(fetchPostsBegin());
      return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_VERSION+post_type)
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
          dispatch(fetchPostsSuccess({type:post_type,data:json}));
        })
        .catch(error => dispatch(fetchPostsError(error)));
    };
  }
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }