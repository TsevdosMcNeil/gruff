import React from 'react';
import Index from './../components/Stories/Details';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
    return {menu:state.menu,options:state.options, projects:state.projects, stories:state.stories};
}
const StoryDetails = connect(mapStateToProps)(Index);

export default StoryDetails;