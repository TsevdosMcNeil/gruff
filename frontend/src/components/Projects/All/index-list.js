import React from 'react';
import Header from '../../Header'
import List from './List'
import GruffLoader from './../../GruffLoader'
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";

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
      this.props.dispatch(fetchProjects()),
      this.props.dispatch(fetchOptions())
    ]).then(() => {
      this.setState({
        pageLoading:false
      })
    });  
  }
  render() {
    return (
      <div className="gruff--Projects fullW">
        {this.state.pageLoading &&
          <GruffLoader />
        }
        <Header {...this.props}/>
        <List {...this.props}/>
      </div>
    );
  }
}

export default Index;