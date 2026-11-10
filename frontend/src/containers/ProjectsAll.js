import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Projects/All';

const mapStateToProps = (state) => {
    return {menu:state.menu,options:state.options,projects:state.projects,projectTransitions:state.projectTransitions};
}
const Contact = connect(mapStateToProps)(Index);

export default Contact;