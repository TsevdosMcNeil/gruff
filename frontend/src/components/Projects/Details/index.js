import React from 'react';
import Header from '../../Header';
import GruffLoader from './../../GruffLoader'
import Layout1 from './Layout1';
import ProjectList from './../All/SingleProjectList';
import RecentProjects from './../All/Recent';
import ReactFullpage from '@fullpage/react-fullpage';
import { detailsLoadedSuccess } from "./../../../actions/transitionActionCreators";
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.state = {
      pageLoading:false
    }
  }

  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects())
    ]).then(() => {
        this.setState({
          pageLoading:false
        })
    });  

    setTimeout(()=>{
      this.props.dispatch(detailsLoadedSuccess({detailsClass:'is-fading'}));
    },1000)
  }
  render() {
    let projects = this.props.projects.data;
        
    let details_slug  = this.props.match.params.details;
    let projectList   = projects.filter((item) => {
      return item.post_name == details_slug;
    });

    if(projectList[0] === undefined) return [];
    let layoutData = projectList[0].layout.map((row, index) => {
      return (
        index < projectList[0].layout.length - 1 ?
          <div className="section" dangerouslySetInnerHTML={{__html:row}} />
        : <div className="section recent-project-section"><div className="fullW" dangerouslySetInnerHTML={{__html:row}} /><RecentProjects {...this.props}/></div>  
      )  
    })
    //console.log(layoutData);

    let {clkClass,detailsClass,redirect} = this.props.projectTransitions.transitionData;
    const Fullpage = () => (
      <ReactFullpage
        normalScrollElements= '.recent-project-section'
        scrollOverflow={true}
        afterLoad={
          function(origin, destination, direction){}
        }
        onLeave={ 
          function(origin, destination, direction){}
        }
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section"><Layout1 {...this.props} details={projectList[0]} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              {layoutData}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className={`gruff--ProjectDetails fullW ${detailsClass}`}>
        {this.state.pageLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Fullpage {...this.props} />
        <div className="fadingOverlay fullW">
          <div className="gruff-ProjectsGrid fullW">
            <ProjectList {...this.props} projectList={projectList[0]} handleClick={false} clkClass={clkClass}  />
          </div>  
        </div>
      </div>
    );
  }
}

export default Index;