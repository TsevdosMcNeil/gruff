import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'

class RecentProjects extends React.Component {	
  render() {
    let heading = this.props.heading ? this.props.heading : 'Recent Projects';
      
    let details_slug  = this.props.match.params.details;

    let listContent = this.props.projects.recent_projects;

    if(listContent.length == 0) return [];

    listContent = listContent.filter((item) => {
        return item.post_name != details_slug;
    });
    
    listContent = listContent.splice(0,3);

    const allListContents = listContent.map((listContent,index) => {
        return(
            <div className="item" key={index} >
                <Link className="fullW"  to={`${process.env.PUBLIC_URL}/project/${listContent.post_name}`} >
                    <span className="img-container fullW">
                        <img src={listContent.hero_image.url} title={listContent.post_title} alt={listContent.post_title} className="recentImg"/>
                    </span>
                    <p className="title" dangerouslySetInnerHTML={{__html: listContent.post_title}} />
                </Link>
            </div>
        )
    })


    return (
        <div className="gruff-RecentProjects fullW">
            <p className="secTitle">{heading}</p>
            <div className="items-3 fullW">
              {allListContents}
            </div>
        </div>
    );
  }
}

export default RecentProjects;
