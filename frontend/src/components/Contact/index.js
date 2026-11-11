import React from 'react';
import Header from '../Header';
import GruffLoader from './../GruffLoader'
import Carousel from './../Practice/Carousel';
import People from './../People/People';
import Contact from './Content';
import PortaitImg from './../Practice/PortaitImg';
import LandscapeImg from './../Practice/LandscapeImg';
import { fetchPosts } from "./../../actions/postActionCreators";
import { fetchPage } from "./../../actions/pageActionCreators";
import { fetchPeople } from "./../../actions/peopleActionCreators";
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchProjects } from "./../../actions/projectActionCreators";
import { fetchAwards } from "./../../actions/awardActionCreators";

import Awards from './../Practice/Awards';
import Practice1 from './../Practice/Practice1';
import Practice2 from './../Practice/Practice2';
import Practice3 from './../Practice/Practice3';
import Practice4 from './../Practice/Practice4';
import Practice5 from './../Practice/Practice5';

import ReactFullpage from '@fullpage/react-fullpage';
import { showLoader, hideLoader } from '../../actions/transitionActionCreators';
import 'fullpage.js/vendors/scrolloverflow';

const page_id = '19';
const slider_name = 'team-sliders';

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.props.dispatch(showLoader())
  }
  componentDidMount(){
        
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects()),
      this.props.dispatch(fetchPage(page_id)),
      this.props.dispatch(fetchPosts(slider_name)),
      this.props.dispatch(fetchPeople()),
      this.props.dispatch(fetchAwards())
    ]).then(() => {
      this.props.dispatch(hideLoader());
      this.goToSection();
    });
  }

  componentDidUpdate(){
    this.goToSection();
  }

  goToSection = () => {
    if(!document.querySelector(".contactActivated")) return;

    let currentURL = window.location.href;
    let splitURL =  currentURL.split("/");
    let currentPageName = splitURL[splitURL.length - 1];

    if(currentPageName === 'contact' || 'people'){
      let actvElmnt = document.querySelector(".contactActivated").offsetTop;
      window.scrollTo(0, actvElmnt);
    }  
  }
  
  render() {
    let _this = this;
    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        scrollOverflow={true}
        responsiveWidth={1201}
        responsiveHeight={650}
        afterLoad={
          function(origin, destination, direction){}
        }
        onLeave={ 
          function(origin, destination, direction){}
        }
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section fp-auto-height-responsive"><Practice1 {...this.props} page_id={page_id} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive"><Practice2 {...this.props} page_id={page_id} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive"><Practice3 {...this.props} page_id={page_id} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive"><Practice4 {...this.props} page_id={page_id} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive"><Practice5 {...this.props} page_id={page_id} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive awards"><Awards {...this.props}/><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive portaitImg"><PortaitImg {...this.props} page_id={page_id}/><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive landscapeImg"><LandscapeImg {...this.props} page_id={page_id} image_field={'image_one'} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive landscapeImg"><LandscapeImg {...this.props} page_id={page_id} image_field={'image_two'} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive landscapeImg"><LandscapeImg {...this.props} page_id={page_id} image_field={'image_three'} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive"><People {...this.props} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive active fullW contactActivated"><Contact {...this.props}  /></div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className="gruff--Practice gruff--Practice-Contact fullW">
        {this.props.loader.gruffLoader.isLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Fullpage {...this.props} />
      </div>
    );
  }
}

export default Index;
