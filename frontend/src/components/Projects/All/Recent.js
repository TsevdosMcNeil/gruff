import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'

class RecentProjects extends React.Component {	
  render() {

    let listContent = this.props.projects.recent_projects;
    if(listContent.length == 0) return [];

    const allListContents = listContent.map((listContent,index) => {
        return(
            <div className="item" key={index} >
                <Link className="fullW"  to={`${process.env.PUBLIC_URL}/project/${listContent.post_name}`} >
                    <span className="img-container fullW">
                        <img src={listContent.hero_image.url} title={listContent.post_title} alt={listContent.post_title}/>
                    </span>
                    <p className="title" dangerouslySetInnerHTML={{__html: listContent.post_title}} />
                </Link>
            </div>
        )
    })


    return (
        <div className="gruff-RecentProjects fullW">
            <p className="secTitle">Recent Projects</p>
            <div className="items-3 fullW">
              {allListContents}
            </div>
        </div>
    );
  }
}

export default RecentProjects;