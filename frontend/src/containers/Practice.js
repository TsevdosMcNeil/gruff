import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Practice';

const mapStateToProps = (state) => {
    return {pages:state.pages, posts:state.posts,menu:state.menu,options:state.options, people:state.people, projects:state.projects, awards: state.awards, loader:state.loader};
}
const Practice = connect(mapStateToProps)(Index);

export default Practice;
