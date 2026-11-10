import React from 'react';
import Header from './../Header'
import Banner from './Banner'
import GruffLoader from './../GruffLoader'
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchPosts } from "./../../actions/postActionCreators";
import { fetchStories } from "./../../actions/storyActionCreators";

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.state = {
      pageLoading:true
    }
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchPosts('home-sliders')),
      this.props.dispatch(fetchStories())
    ]).then(() => {
        this.setState({
          pageLoading:false
        })
    });  
  }

  render() {
    return (
      <div className="gruff--Home fullW">
        {this.state.pageLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Banner {...this.props}/>
      </div>
    );
  }
}

export default Index;