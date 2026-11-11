import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'
import ReactFullpage from '@fullpage/react-fullpage';


class StoryListing extends React.Component {	
    render() {
        let articles = this.props.stories.data;
        if(articles.length === 0) return [];
        const allListContents = articles.map((item,index) => {
            return(
                <Link className="item btn-rightarrowHover fullW" to={`${process.env.PUBLIC_URL}/story/${item.post_name}`} key={index}>
                    <span className="img-container fullW">
                        <img src={item.thumbnail_image.url} title={item.post_title} alt={item.post_title}/>
                    </span>
                    <div className="content-container">
                        <div className="fullW">
                            <h6 className="title fullW">{item.post_title}</h6>
                            <div className="title fullW" dangerouslySetInnerHTML={{__html: item.sub_heading}} />
                        </div>
                        <span className="btn-rightarrow" >View Story</span>
                    </div>
                </Link>
                        
            )
        })

        return (
            <div className="gruff-AllStories fullW">
                {allListContents}
            </div>
        );
    }
}

export default StoryListing;
