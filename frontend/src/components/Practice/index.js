import React from 'react';
import Header from '../Header';
import Carousel from './Carousel';
import People from './../People/People';
import Awards from './Awards';
import PortaitImg from './PortaitImg';
import LandscapeImg from './LandscapeImg';
import GruffLoader from './../GruffLoader'
import Contact from './../Contact/Content';

import Practice1 from './Practice1';
import Practice2 from './Practice2';
import Practice3 from './Practice3';
import Practice4 from './Practice4';
import Practice5 from './Practice5';

import { fetchPosts } from "./../../actions/postActionCreators";
import { fetchPeople } from "./../../actions/peopleActionCreators";
import { fetchPage } from "./../../actions/pageActionCreators";
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchProjects } from "./../../actions/projectActionCreators";
import { fetchAwards } from "./../../actions/awardActionCreators";
import ReactFullpage from '@fullpage/react-fullpage';
import { showLoader, hideLoader } from '../../actions/transitionActionCreators';
import 'fullpage.js/vendors/scrolloverflow';

const page_id     = '19';
const slider_name = 'team-sliders';
const gruffPluginWrapper = () => {
  require('fullpage.js/vendors/scrolloverflow');
  require('../../lib/fullpage.offsetSections.min');
};

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
      this.props.dispatch(fetchPosts(slider_name)),
      this.props.dispatch(fetchPeople()),
      this.props.dispatch(fetchAwards())
    ]).then(() => {
      this.props.dispatch(hideLoader())
    });  
  }
  
  render() {
    let _this = this;
    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        scrollOverflow={true}
        responsiveWidth={1201}
        responsiveHeight={650}
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
              <div className="section fp-auto-height-responsive people"><People {...this.props} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section fp-auto-height-responsive fullW"><Contact {...this.props}  /></div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className="gruff--Practice fullW">
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
