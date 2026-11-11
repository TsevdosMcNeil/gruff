import React from 'react';
import Header from '../../Header';
import GruffLoader from './../../GruffLoader'
import Layout0 from './Layout0';
import ProjectList from './../All/SingleProjectList';
import RecentProjects from './../All/Recent';
import ReactFullpage from '@fullpage/react-fullpage';
import { detailsLoadedSuccess, showLoader, hideLoader } from "./../../../actions/transitionActionCreators";
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";
import {
    NavLink,
    Link
} from 'react-router-dom'

const gruffPluginWrapper = () => {
  require('fullpage.js/vendors/scrolloverflow');
  require('../../../lib/fullpage.offsetSections.min');
};
class Index extends React.Component {	
  constructor(props){
    super(props);
    //this.props.dispatch(showLoader());
  }

  componentDidMount(){
    let parent = document.getElementById('root');
    parent.classList.remove('listEnd');

    let slug = this.props.match.params.details;
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects(slug))
    ]).then(() => {
      this.props.dispatch(hideLoader())
    });  

    setTimeout(()=>{
      this.props.dispatch(detailsLoadedSuccess({detailsClass:'is-fading'}));
    },1000)
  }
  render() {    
    let {clkClass,detailsClass,redirect} = this.props.projectTransitions.transitionData;

    let details_slug  = this.props.match.params.details;

    let projects = this.props.projects.all;
    
    let projectList   = projects.filter((item) => {
      return item.post_name == details_slug;
    });

    if(projectList[0] === undefined) return [];
    //console.log(layoutData);
    //console.log(clkClass)

    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        responsiveWidth={1201}
        responsiveHeight={650}
        gruffPluginWrapper
        offsetSections={true}
        render={({ state, fullpageApi }) => {
          let layoutData = projectList[0].layout.map((row, index) => {
            return (
              <div className="section fp-auto-height-responsive"  key={index}>
                  <div className="gruff-DetailsInner fullW" dangerouslySetInnerHTML={{__html:row}}/> 
                  {/* <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a> */}
              </div>
            )  
          })
          return (
            <ReactFullpage.Wrapper>
              <div className="section fp-auto-height-responsive">
                <Layout0 {...this.props} details={projectList[0]} />
                <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a>
              </div>
              {layoutData}
              <div className="section recent-project-section fp-auto-height" data-percentage={50} data-centered={true}>
                <div className="btn-container">
                  <NavLink to={`${process.env.PUBLIC_URL}/projects/list`} className="btn-leftarrow">Back to Projects</NavLink>
                  <a href="javascript:"  onClick={() => fullpageApi.moveTo(1)} className="btn-toparrow"><span>Back to </span>Top</a>
                </div>
                <RecentProjects {...this.props}/>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className={`gruff--ProjectDetails fullW ${detailsClass}`}>
        {this.props.loader.gruffLoader.isLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Fullpage {...this.props} />
        <div className="fadingOverlay fullW">
          <div className="gruff-ProjectsList fullW">
            <ProjectList {...this.props} projectList={projectList[0]} handleClick={false} clkClass={clkClass}  />
          </div>  
        </div>
      </div>
    );
  }
}

export default Index;
