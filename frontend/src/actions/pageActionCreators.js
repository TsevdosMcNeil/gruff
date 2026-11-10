//Load Page
export const fetchPageBegin = () => ({
    type: 'FETCH_PAGE_BEGIN'
});

export const fetchPageSuccess = page => ({
    type: 'FETCH_PAGE_SUCCESS',
    payload: { page_id:page.data.id,data:page.data }
});

export const fetchPageError = error => ({
    type: 'FETCH_PAGE_FAILURE',
    payload: { error }
});

export function fetchPage(page_id) {
    return dispatch => {
      dispatch(fetchPageBegin());
      return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_VERSION+'pages/'+page_id)
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
            dispatch(fetchPageSuccess({data:json}));
        })
        .catch(error => dispatch(fetchPageError(error)));
    };
  }
  
  // Handle HTTP errors since fetch won't.
  function handleErrors(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }