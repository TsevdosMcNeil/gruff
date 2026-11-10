const initialState = {
    data:[],
    loading: true,
    error: null
};
export default function fetchStories(state = initialState,action){
    switch(action.type) {
        case 'FETCH_STORIES_BEGIN':
            return {
                ...state,
                loading: true,
                error: null
            };
    
        case 'FETCH_STORIES_SUCCESS':
            return {
                ...state,
                loading: false,
                data:action.payload.stories,
            };
    
        case 'FETCH_STORIES_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                data:[],
            };
    
        default:
          return state;
      }
}