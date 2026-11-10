import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'
import HeaderLogo from '../../HeaderLogo';
import ViewIcons from './ViewIcons';
import Masonry from 'react-masonry-css'

class ProjectsList extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let projectList = this.props.projects.data;
    if(projectList.length == 0) return [];
    
    const allProjectList = projectList.map((project,index) => {
      return(
        <Link className="item" to={`${process.env.PUBLIC_URL}/project/${project.post_name}`} key={index} >
          <h6>{project.post_title}</h6>
          <img src={project.grid_image.url} title={project.post_title} alt={project.post_title}/>
        </Link>
      )
    })

    const breakpointColumnsObj = {
      default: 3,
      1400: 3,
      700: 2,
      500: 1
    };

    return (
      <div className="gruff-ProjectsList fullW">
          <HeaderLogo {...this.props}/>
          <ViewIcons {...this.props}/>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="gruff-MasonryProjectList fullW"
            columnClassName="grid_column"
          >
              {allProjectList}
          </Masonry>
      </div>
    );
  }
}

export default ProjectsList;