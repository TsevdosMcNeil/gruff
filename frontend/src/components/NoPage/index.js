import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'
import Header from './../Header'
import HeaderLogo from './../HeaderLogo';
import GruffLoader from './../GruffLoader'
import GImg from './../../assets/img/logo/logoW.svg';
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
      this.props.dispatch(fetchStories())
    ]).then(() => {
        this.props.dispatch(hideLoader())
    });  
  }

  render() {
    return (
      <div className="gruff--404 menusmoke fullW">
        {this.props.loader.gruffLoader.isLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <HeaderLogo />
        <div className="gruff-404content">
            <h5 className="titlehg">Nothing to see here</h5>
            <p className="desc">The page you are looking for was removed or might never existed.</p>
            <NavLink to={`${process.env.PUBLIC_URL}/`} className="btn-leftarrow">Go to Home Page</NavLink>
        </div>
      </div>
    );
  }
}

export default Index;
