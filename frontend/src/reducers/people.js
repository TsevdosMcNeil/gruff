const initialState = {
  data:[],
  loading: true,
  error: null
};
export default function fetchPeople(state = initialState,action){
    switch(action.type) {
        case 'FETCH_PEOPLE_BEGIN':
          return {
            ...state,
            loading: true,
            error: null
          };
    
        case 'FETCH_PEOPLE_SUCCESS':
          return {
            ...state,
            loading: false,
            data:action.payload
          };
    
        case 'FETCH_PEOPLE_FAILURE':
          return {
            ...state,
            loading: false,
            error: action.payload.error,
            data:[]
          };
    
        default:
          return state;
      }
}
