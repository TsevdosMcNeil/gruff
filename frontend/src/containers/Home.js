import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Index from './../components/Home';

const mapStateToProps = (state) => {
    return {posts:state.posts,menu:state.menu,options:state.options};
}

const Home = connect(mapStateToProps)(Index);

export default Home;