const initialState = {
    options:{},
    loading: true,
    error: null
};
export default function fetchOptions(state = initialState,action){
    switch(action.type) {
        case 'FETCH_OPTIONS_BEGIN':
            return {
                ...state,
                loading: true,
                error: null
            };
    
        case 'FETCH_OPTIONS_SUCCESS':

            return {
                ...state,
                loading: false,
                options:action.payload
            };
    
        case 'FETCH_OPTIONS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                options: {}
            };
    
        default:
            return state;
      }
}
