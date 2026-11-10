const initialState = {
    transitionData:{
        clkClass:'',
        redirect:false,
        url:'',
        detailsClass:''
    },
    loading: true,
    error: null
};
export default function makeTransition(state = initialState,action){
    switch(action.type) {
        case 'FETCH_TRANSITION_BEGIN':
            return {
                ...state,
                transitionData:initialState.transitionData,
                loading: true,
                error: null
            };
    
        case 'FETCH_TRANSITION_SUCCESS':
            return {
                ...state,
                loading: false,
                transitionData:action.payload
            };
    
        case 'FETCH_TRANSITION_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                transitionData:initialState
            };
        case 'LOAD_DETAILS_SUCCESS':{
            return {
                ...state,
                loading: false,
                transitionData:action.payload
            }
        }    
        case 'DETAILS_LOADED_SUCCESS':
            return {
                ...state,
                loading: false,
                error: false,
                transitionData:action.payload
            };
        default:
          return state;
      }
}