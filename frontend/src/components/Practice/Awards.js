import React from 'react';
import Masonry from 'react-masonry-css';

const breakpointColumnsObj = {
  default: 2,
  620: 1
};

class Awards extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    const awards = this.props.awards.data;

    var allAwards = awards.map((award,index) => {
			return (
        <div className="gruff-awardBox" key={index}>
            <div className="title" dangerouslySetInnerHTML={{__html: award.award_name}} />
            <p className="desc">{award.result}</p>
        </div>
			)
		})

    return (
      <div className="gruff-Awards fullW">
          <div className="gruff-AwardsInner fullW">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="gruff-MasonryProjectList fullW"
              columnClassName="grid_column"
            >
              {allAwards}
            </Masonry>
          </div>
      </div>
    );
  }
}

export default Awards;
