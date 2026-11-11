import React from 'react';

class Practice4 extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let section_four = !(page_id in data) ? '' : data[page_id].acf.section_four;
    
    if(!section_four) return [];

    let {image,background_color,text_color,text} = section_four;

    return (
      <div className="gruff-PracticeLayout layout4 fullW">
          <div className="screenfluid-left">
            <img src={image.url} title={image.title} alt={image.alt}/>
          </div>
          <div className="screenfluid-right" style={{'backgroundColor':background_color}}>
            <div className="titlelg" style={{color:text_color}} dangerouslySetInnerHTML={{__html:text}} />
          </div>
      </div>
    );
  }
}

export default Practice4;
