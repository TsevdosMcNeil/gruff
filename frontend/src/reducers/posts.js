const initialState = {
    items:{
      data:{},
      loading: true,
      error: null
    }
};
export default function fetchPosts(state = initialState,action){
    switch(action.type) {
        case 'FETCH_POSTS_BEGIN':
          return {
            ...state,
            loading: true,
            error: null
          };
    
        case 'FETCH_POSTS_SUCCESS':
          return {
            ...state,
            loading: false,
            items: {
              data:{
                ...state.items.data,
                [action.payload.type] : action.payload.data
              }
            }
          };
    
        case 'FETCH_POSTS_FAILURE':
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            items: {
              data:{}
            }
          };
    
        default:
          return state;
      }
}