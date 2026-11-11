import React from 'react';
class PortaitImg extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let left_image =  !(page_id in data) ? 
                      '' : 
                        !('studio_shots' in data[page_id].acf) ?
                          '' :
                          data[page_id].acf.studio_shots.two_col.left_image;
    let right_image = !(page_id in data) ? 
                      '' : 
                        !('studio_shots' in data[page_id].acf) ?
                        '' :
                        data[page_id].acf.studio_shots.two_col.right_image;
    return (
      <div className="gruff-PortaitImg">
        {left_image &&
          <div className="fulidImg-container">        
            <img src={left_image.url} title={left_image.title} alt={left_image.alt}/>
          </div>
        }
        
        {right_image &&
          <div className="fulidImg-container">        
            <img src={right_image.url} title={right_image.title} alt={right_image.alt}/>
          </div>
        }
      </div>
    );
  }
}

export default PortaitImg;
