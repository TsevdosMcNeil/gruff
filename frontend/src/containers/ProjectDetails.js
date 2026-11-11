import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Projects/Details';

const mapStateToProps = (state) => {
    return {menu:state.menu,options:state.options,projects:state.projects,projectTransitions:state.projectTransitions, loader:state.loader};
}
const Contact = connect(mapStateToProps)(Index);

export default Contact;
