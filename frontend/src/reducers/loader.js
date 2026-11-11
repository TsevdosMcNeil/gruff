const initialState = {
    gruffLoader:{
        isLoading:true,
    },
};
export default function manageLoader(state = initialState,action){
    switch(action.type) {
        case 'SHOW_LOADER':
            return {
                ...state,
                gruffLoader:{
                    isLoading:true
                },
            };
    
        case 'HIDE_LOADER':
            return {
                ...state,
                gruffLoader:{
                    isLoading:false
                },
            };
        default:
          return state;
      }
}
