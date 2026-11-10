const initialState = {
    pageData:{},
    loading: true,
    error: null
};
export default function fetchPage(state = initialState,action){
    switch(action.type) {
        case 'FETCH_PAGE_BEGIN':
          return {
            ...state,
            loading: true,
            error: null
          };
    
        case 'FETCH_PAGE_SUCCESS':
          return {
            ...state,
            loading: false,
            pageData:{...state.pageData, [action.payload.page_id] : action.payload.data}
          };
    
        case 'FETCH_PAGE_FAILURE':
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            pageData: {}
          };
    
        default:
          return state;
      }
}