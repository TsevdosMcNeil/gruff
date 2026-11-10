const initialState = {
    menu:[],
    targetClass:'gruff-Header',
    handlarClass:'hammenu',
    loading: true,
    error: null
};
export default function fetchMenu(state = initialState,action){
    switch(action.type) {
        case 'FETCH_MENU_BEGIN':
            return {
                ...state,
                loading: true,
                error: null
            };
    
        case 'FETCH_MENU_SUCCESS':

            return {
                ...state,
                loading: false,
                menu:action.payload
            };
    
        case 'FETCH_MENU_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                menu: []
            };
        case 'TOGGLE_MENU':
            return {
                ...state,
                loading: false,
                error: null,
                targetClass:action.payload.targetClass,
                handlarClass:action.payload.handlarClass
            }    
        default:
            return state;
      }
}