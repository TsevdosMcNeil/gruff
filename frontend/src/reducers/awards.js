const initialState = {
    data:[],
    loading: true,
    error: null
  };
  export default function fetchAwards(state = initialState,action){
      switch(action.type) {
          case 'FETCH_AWARDS_BEGIN':
            return {
              ...state,
              loading: true,
              error: null
            };
      
          case 'FETCH_AWARDS_SUCCESS':
            return {
              ...state,
              loading: false,
              data:action.payload
            };
      
          case 'FETCH_AWARDS_FAILURE':
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
