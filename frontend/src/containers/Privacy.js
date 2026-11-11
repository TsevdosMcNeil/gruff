import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Privacy';

const mapStateToProps = (state) => {
    return {pages:state.pages, posts:state.posts,menu:state.menu,options:state.options, projects:state.projects, loader:state.loader};
}
const Privacy = connect(mapStateToProps)(Index);

export default Privacy;
