import React from 'react';
import HeaderLogo from './../../HeaderLogo';
import Header from './../../Header';
import GruffLoader from './../../GruffLoader'
import Listing from './Listing';
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchStories } from "./../../../actions/storyActionCreators";

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.state = {
      pageLoading:true
    }
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchStories()),
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects())
    ]).then(() => {
      this.setState({
        pageLoading:false
      })
    });
  }
  render() {
    return (
      <div className="gruff--Stories fullW">
        {this.state.pageLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Listing {...this.props}/>
      </div>
    );
  }
}

export default Index;