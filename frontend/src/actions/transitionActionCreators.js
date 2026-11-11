//Load posts
export const fetchTransitionBegin = () => ({
    type: 'FETCH_TRANSITION_BEGIN'
});

export const fetchTransitionSuccess = () => ({
    type: 'FETCH_TRANSITION_SUCCESS',
    payload:{
        clkClass:'is-projDtlsLoading',
    }
});

export const loadDetailsSuccess = (data) => ({
    type: 'LOAD_DETAILS_SUCCESS',
    payload:{
        url:data.url,
        redirect:true,
        clkClass:'is-projDtlsLoading',
    }
});

export const detailsLoadedSuccess = (data) => ({
    type: 'DETAILS_LOADED_SUCCESS',
    payload:{
        detailsClass:data.detailsClass,
    }
});

export const fetchTransitionError = error => ({
    type: 'FETCH_TRANSITION_FAILURE',
    payload: { error }
});

export const showLoader = () => ({
    type: 'SHOW_LOADER'
});

export const hideLoader = () => ({
    type: 'HIDE_LOADER'
});
