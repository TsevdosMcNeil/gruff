import React from 'react';
import Header from '../../Header'
import List from './List'
import GruffLoader from './../../GruffLoader'
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";
import { showLoader, hideLoader } from '../../../actions/transitionActionCreators';

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.props.dispatch(showLoader());
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchProjects()),
      this.props.dispatch(fetchOptions())
    ]).then(() => {
      this.props.dispatch(hideLoader())
    });  
  }
  render() {
    return (
      <div className="gruff--Projects fullW">
        {this.props.loader.gruffLoader.isLoading &&
          <GruffLoader />
        }
        <Header {...this.props}/>
        <List {...this.props}/>
      </div>
    );
  }
}

export default Index;
