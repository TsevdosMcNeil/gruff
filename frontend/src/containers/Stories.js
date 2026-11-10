import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Stories/All';

const mapStateToProps = (state) => {
    return {menu:state.menu,options:state.options, projects:state.projects, stories:state.stories};
}
const Stories = connect(mapStateToProps)(Index);

export default Stories;