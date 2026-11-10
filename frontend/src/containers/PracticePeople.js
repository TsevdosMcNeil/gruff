import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/PracticePeople';

const mapStateToProps = (state) => {
    return {pages:state.pages, posts:state.posts,menu:state.menu,options:state.options, people:state.people, projects:state.projects};
}
const PracticePeople = connect(mapStateToProps)(Index);

export default PracticePeople;