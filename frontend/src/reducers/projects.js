const initialState = {
    all:[],
    featured:[],
    others:[],
    all_others:[],
    recent_projects:[],
    loading: true,
    error: null
};
export default function fetchProjects(state = initialState,action){
    switch(action.type) {
        case 'FETCH_PROJECTS_BEGIN':
            return {
                ...state,
                loading: true,
                error: null
            };
    
        case 'FETCH_PROJECTS_SUCCESS':
            return {
                ...state,
                loading: false,
                all:action.payload.all,
                featured:action.payload.featured,
                others:action.payload.others,
                all_others:action.payload.all_others,
                recent_projects:action.payload.recent_projects,
            };
    
        case 'FETCH_PROJECTS_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                all:[],
                featured:[],
                others:[],
                all_others:[],
                recent_projects:[]
            };
    
        default:
          return state;
      }
}
