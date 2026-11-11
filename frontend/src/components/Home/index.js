import React from 'react';
import Header from './../Header'
import Banner from './Banner'
import GruffLoader from './../GruffLoader'
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchPosts } from "./../../actions/postActionCreators";
import { fetchStories } from "./../../actions/storyActionCreators";
import { showLoader, hideLoader } from '../../actions/transitionActionCreators';

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.props.dispatch(showLoader());
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchPosts('home-sliders')),
      this.props.dispatch(fetchStories())
    ]).then(() => {
        this.props.dispatch(hideLoader())
    });  
  }

  render() {
    return (
      <div className="gruff--Home fullW">
        {this.props.loader.gruffLoader.isLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Banner {...this.props}/>
      </div>
    );
  }
}

export default Index;
