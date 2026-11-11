import React from 'react';
import Header from '../Header';
import GruffLoader from './../GruffLoader'
import Content from './Content';
import RecentProjects from './../Projects/All/Recent';
import { fetchPage } from "./../../actions/pageActionCreators";
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchProjects } from "./../../actions/projectActionCreators";
import { showLoader, hideLoader } from '../../actions/transitionActionCreators';

const page_id     = '654';

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.props.dispatch(showLoader());
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects()),
      this.props.dispatch(fetchPage(page_id)),
    ]).then(() => {
      this.props.dispatch(hideLoader())
    });  
  }
  
  render() {
    return (
        <div className="gruff--Privacy menusmoke fullW">
            {this.props.loader.gruffLoader.isLoading &&
                <GruffLoader />
            } 
            <Header {...this.props}/>
            <Content {...this.props} page_id={page_id} />
            <RecentProjects {...this.props}/>
        </div>
    );
  }
}

export default Index;
