import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/NoPage';

const mapStateToProps = (state) => {
    return {posts:state.posts,menu:state.menu,options:state.options, loader:state.loader};
}

const NoPage = connect(mapStateToProps)(Index);

export default NoPage;
