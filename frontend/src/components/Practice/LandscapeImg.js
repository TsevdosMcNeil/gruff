import React from 'react';
class LandscapeImg extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let image = !(page_id in data) ? '' : data[page_id].acf.studio_shots[this.props.image_field];
    return (
      <div className="gruff-LandscapeImg">
        {image &&
          <div className="fulidImg-container">        
            <img src={image.url} title={image.title} alt={image.alt}/>
          </div>
        }
      </div>
    );
  }
}

export default LandscapeImg;
