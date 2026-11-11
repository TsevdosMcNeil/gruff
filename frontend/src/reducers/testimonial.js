const initialState = {
    data:[],
    loading: true,
    error: null
  };
  export default function fetchTestimonial(state = initialState,action){
      switch(action.type) {
          case 'FETCH_TESTIMONIAL_BEGIN':
            return {
              ...state,
              loading: true,
              error: null
            };
      
          case 'FETCH_TESTIMONIAL_SUCCESS':
            return {
              ...state,
              loading: false,
              data:action.payload
            };
      
          case 'FETCH_TESTIMONIAL_FAILURE':
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
