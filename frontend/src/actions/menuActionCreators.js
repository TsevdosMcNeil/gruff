//Load the menu
export const fetchMenuBegin = () => ({
    type: 'FETCH_MENU_BEGIN'
});

export const fetchMenuSuccess = menu => ({
    type: 'FETCH_MENU_SUCCESS',
    payload:menu
});

export const fetchMenuError = error => ({
    type: 'FETCH_MENU_FAILURE',
    payload: { error }
});

export function fetchMenu(menu_slug) {
    return dispatch => {
      dispatch(fetchMenuBegin());
      return fetch(process.env.REACT_APP_API_URL+process.env.REACT_APP_API_CUSTOM_PREFIX+menu_slug)
        .then(handleErrors)
        .then(res => res.json())
        .then(json => {
          dispatch(fetchMenuSuccess(json));
        })
        .catch(error => dispatch(fetchMenuError(error)));
    };
  }
  
// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

//Toggle Menu
export const toggleMenu = (options = {}) => ({
  type: 'TOGGLE_MENU',
  payload: options
})  
