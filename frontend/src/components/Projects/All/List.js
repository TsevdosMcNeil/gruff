import React from 'react';
import ProjectImage from './ProjectImage';
import {
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import { fetchTransitionBegin,fetchTransitionSuccess,loadDetailsSuccess } from "./../../../actions/transitionActionCreators";
import ReactFullpage from '@fullpage/react-fullpage';
import HeaderLogo from '../../HeaderLogo';
import ViewIcons from './ViewIcons';

class ProjectsGrid extends React.Component {	
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount(){
    this.props.dispatch(fetchTransitionBegin({}));
  }
  
  handleClick = (e) => {
    let url = e.currentTarget.getAttribute("data-url");
    //console.log(url);return;
    this.props.dispatch(fetchTransitionSuccess());
    setTimeout(() => {
      this.props.dispatch(loadDetailsSuccess({url}));
    },1000)
  }
  
  displayDetails(projectList, section){
    var details = projectList.filter((item) => {
      return item.post_name == section.item.getAttribute('data-projectlink');
    })
    let elem = document.getElementById('projectDetailsSidebar');

    elem.querySelector('.list-view').style.color = details[0].icon_color;
    elem.querySelector('.grid-view').style.color = details[0].icon_color;
    
    Array.from(elem.querySelectorAll('line')).forEach((item, key) => {
      item.setAttribute('stroke',details[0].icon_color);
    })
    Array.from(elem.querySelectorAll('rect')).forEach((item, key) => {
      item.setAttribute('fill',details[0].icon_color);
    })
    elem.childNodes[0].style.color = details[0].list_view_color;
    elem.childNodes[0].querySelector('h6').innerHTML = details[0].post_title;
    elem.childNodes[0].querySelector('.titlelg').innerHTML = details[0].sub_heading;
    elem.querySelector('.screenfluid-left').setAttribute('data-url', `${process.env.PUBLIC_URL}/project/${details[0].post_name}`);
    document.getElementById('placeholderImg').setAttribute('src',details[0].list_image.url);
    //console.log( elem.querySelector('.list-view'));
  }

  render() {
    let {url,redirect,clkClass} = this.props.projectTransitions.transitionData;
    let _this= this;
    if(redirect){
      this.props.history.push(url);
    }
    let projectList = this.props.projects.data;

    if(projectList.length == 0) return [];
    
    const Fullpage = () => (
      <ReactFullpage
        afterLoad={
          function(origin, destination, direction){
            _this.displayDetails(projectList,destination)
          }
        }
        onLeave={ 
          function(origin, destination, direction){
            _this.displayDetails(projectList,destination)
          }
        }
        render={({ state, fullpageApi }) => {
          const allProjects = projectList.map((project,index) => {      
            return(
              <div className="section" key={index} data-projectlink={project.post_name}>
                <ProjectImage {..._this.props} project={project} />
                {index == 0 &&
                  <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a>
                }
              </div>
            )
          });
          return (
            <ReactFullpage.Wrapper>
              {allProjects}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className="gruff-ProjectsGrid fullW" id="projectDetailsSidebar" >
        <div className={`screenfluid-left btn-rightarrowHover ${clkClass}`} onClick={_this.handleClick}>
            <HeaderLogo whiteLogo={true} />
            <div className="projectInfo fullW">
                <h6 className="title"></h6>
                <div className="titlelg" />
                <a className="btn-rightarrow" href="javascript:void(0)" >View Project</a>
            </div>
        </div>
        
        <div className="screenfluid-right">
          <ViewIcons {...this.props} />
          {!clkClass &&
            <Fullpage {...this.props} />
          }
          <img id="placeholderImg" />
        </div>
      </div>
    );
  }
}

export default ProjectsGrid;