import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from '../components/Projects/All/index-list';

const mapStateToProps = (state) => {
    return {menu:state.menu,options:state.options,projects:state.projects,projectTransitions:state.projectTransitions};
}
const ProjectList = connect(mapStateToProps)(Index);

export default ProjectList;