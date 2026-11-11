import React from 'react';
import ProjectImage from './ProjectImage';
import {
  Redirect,
  NavLink,
  Link
} from 'react-router-dom';
import RecentProjects from './Recent';
import { fetchTransitionBegin, fetchTransitionSuccess, loadDetailsSuccess } from "./../../../actions/transitionActionCreators";
import ReactFullpage from '@fullpage/react-fullpage';
import HeaderLogo from '../../HeaderLogo';
import ViewIcons from './ViewIcons';
import Grid from './Grid';

const gruffPluginWrapper = () => {
  require('fullpage.js/vendors/scrolloverflow');
  require('../../../lib/fullpage.offsetSections.min');
};

class ProjectsList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchTransitionBegin({}));
  }


  handleClick = (e) => {
    let url = e.currentTarget.getAttribute("data-url");
    //console.log(url);return;
    this.props.dispatch(fetchTransitionSuccess());
    setTimeout(() => {
      this.props.dispatch(loadDetailsSuccess({ url }));
    }, 1000)
  }

  displayDetails(projectList, section) {
    let elem = document.getElementById('projectDetailsSidebar');
    let parent = document.getElementById('root');

    if (section.index < projectList.length) {
      parent.classList.remove('listEnd');
      var details = projectList.filter((item) => {
        return item.post_name == section.item.getAttribute('data-projectlink');
      })
      //document.querySelector('.list-view').style.color = details[0].icon_color;
      document.querySelector('.grid-view').style.color = details[0].icon_color;

      Array.from(document.querySelectorAll('line')).forEach((item, key) => {
        item.setAttribute('stroke', details[0].icon_color);
      })
      Array.from(document.querySelectorAll('rect')).forEach((item, key) => {
        item.setAttribute('fill', details[0].icon_color);
      })
      elem.childNodes[0].style.color = details[0].list_view_color;
      elem.childNodes[0].querySelector('h6').innerHTML = details[0].post_title;
      elem.childNodes[0].querySelector('.titlelg').innerHTML = details[0].sub_heading;
      elem.querySelector('.screenfluid-left').setAttribute('data-url', `${process.env.PUBLIC_URL}/project/${details[0].post_name}`);
      document.getElementById('placeholderImg').setAttribute('src', details[0].list_image.url);
    } else {
      this.gridView();
    }
  }

  gridView = () => {
    let parent = document.getElementById('root');
    parent.classList.add('listEnd');
  }

  render() {
    let { url, redirect, clkClass } = this.props.projectTransitions.transitionData;
    let _this = this;
    if (redirect) {
      this.props.history.push(url);
    }
    let projectList = this.props.projects.featured;

    if (projectList.length == 0) return [];

    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        responsiveWidth={1201}
        responsiveHeight={650}
        gruffPluginWrapper
        offsetSections={true}
        afterLoad={
          function (origin, destination, direction) {
            _this.displayDetails(projectList, destination)
          }
        }
        onLeave={
          function (origin, destination, direction) {
            _this.displayDetails(projectList, destination)
          }
        }
        render={({ state, fullpageApi }) => {

          if (fullpageApi !== undefined && state.destination.isLast) {
            let newHeight = (100 * state.destination.item.clientHeight) / window.innerHeight;
            if (document.getElementsByClassName('screenfluid-left')[0])
              document.getElementsByClassName('screenfluid-left')[0].style.transform = `translateY(-${newHeight}%)`;
          } else {
            if (document.getElementsByClassName('screenfluid-left')[0])
              document.getElementsByClassName('screenfluid-left')[0].style.transform = `translateY(0%)`;
          }

          const allProjects = projectList.map((project, index) => {
            return (
              <div className="section fp-auto-height-responsive" key={index} data-projectlink={project.post_name}>
                <div className="btn-rightarrowHover fullW fullH" data-url={`${process.env.PUBLIC_URL}/project/${project.post_name}`} onClick={_this.handleClick} >
                  <ProjectImage {..._this.props} project={project} />
                  <div className="projectInfo fullW" style={{ color: project.list_view_color }}>
                    <h6 className="title">{project.post_title}</h6>
                    <div className="titlelg" dangerouslySetInnerHTML={{ __html: project.sub_heading }} />
                    <span className="btn-rightarrow">View Project</span>
                  </div>
                </div>
                {/* <div className="lastFeaturedInfo" style={{color: project.list_view_color}} /> */}
                {index < projectList.length - 1 &&
                  <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a>
                }
              </div>
            )
          });
          return (
            <ReactFullpage.Wrapper>
              {allProjects}
              <div className="section fp-auto-height">
                <NavLink to={`${process.env.PUBLIC_URL}/projects/grid`} className="btn-rightarrow">More Projects</NavLink>
                <div className="btn-container">
                  <a href="javascript:" onClick={() => fullpageApi.moveTo(1)} className="btn-toparrow"><span>Back to </span>Top</a>
                </div>
                <RecentProjects {...this.props} />
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className="gruff-ProjectsList fullW " id="projectDetailsSidebar" >
        <div className={`screenfluid-left btn-rightarrowHover ${clkClass}`} onClick={_this.handleClick}>
          <HeaderLogo whiteLogo={true} />
          <div className="projectInfo fullW">
            <h6 className="title"></h6>
            <div className="titlelg" />
            <a className="btn-rightarrow" href="javascript:void(0)" >View Project</a>
          </div>
          {/* <a href="javascript:" className="btn-scrollDown"><span></span></a> */}
        </div>
        <ViewIcons {...this.props} type={1} />
        <div className="screenfluid-right">
          {!clkClass &&
            <Fullpage {...this.props} />
          }
          <img id="placeholderImg" className="placeholderImg" />
        </div>
      </div>
    );
  }
}

export default ProjectsList;
