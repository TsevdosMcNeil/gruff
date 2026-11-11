import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'
import RecentProjects from './Recent';
import HeaderLogo from '../../HeaderLogo';
import ViewIcons from './ViewIcons';
import Masonry from 'react-masonry-css';
import { detailsLoadedSuccess, showLoader, hideLoader } from "./../../../actions/transitionActionCreators";
import ReactFullpage from '@fullpage/react-fullpage';

const gruffPluginWrapper = () => {
  require('fullpage.js/vendors/scrolloverflow');
  require('../../../lib/fullpage.offsetSections.min');
};

const breakpointColumnsObj = {
  default: 3,
  963: 2,
  620: 1
};

class ProjectsGrid extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let projectList = this.props.projects.all_others;
    if(projectList.length == 0) return [];

    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        responsiveWidth={1201}
        responsiveHeight={650}
        gruffPluginWrapper
        offsetSections={true}
        fitToSection={false}
        autoScrolling={false}
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="fullW section fp-auto-height"></div>
              <div className="fullW section fp-auto-height">
                <div className={`gruff-ProjectsGrid fullW`}>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="gruff-MasonryProjectList fullW"
                    columnClassName="grid_column"
                  >
                    {
                      projectList.map((project,key) => {
                        return(
                          <Link className="item fullW" to={`${process.env.PUBLIC_URL}/project/${project.post_name}`} key={key} onClick={() => this.props.dispatch(detailsLoadedSuccess({detailsClass:'is-fading'}))} >
                            <img src={project.grid_image.url} title={project.post_title} alt={project.post_title}/>
                            <h6>{project.post_title}</h6>
                          </Link>
                        )
                      })
                    }      
                  </Masonry>
                </div>
              </div>
              <div className="fullW section fp-auto-height">
                <div className="btn-container">
                  <NavLink to={`${process.env.PUBLIC_URL}/projects/list`} className="btn-leftarrow">Back to Featured Projects</NavLink>
                  <a href="javascript:"  onClick={() => fullpageApi.moveTo(1)}  className="btn-toparrow"><span>Back to </span>Top</a>
                </div>
                <RecentProjects {...this.props}/>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );

    return (
      <div className="gruff-ProjectsGrid fullW">
        <HeaderLogo {...this.props}/>
        <ViewIcons {...this.props} type={2}/>
        <Fullpage {...this.props} />
      </div>
    );
  }
}

export default ProjectsGrid;
