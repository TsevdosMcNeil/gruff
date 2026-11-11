import React from 'react';

class Practice3 extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let section_three = !(page_id in data) ? '' : data[page_id].acf.section_three;
    
    if(!section_three) return [];

    let {image,background_color,text_color,text} = section_three;
    return (
      <div className="gruff-PracticeLayout layout3 fullW">
          <div className="screenfluid-left" style={{'backgroundColor':background_color}}>
            <div className="titlelg" style={{color:text_color}} dangerouslySetInnerHTML={{__html:text}} />
          </div>
          <div className="screenfluid-right">
            <img src={image.url} title={image.title} alt={image.alt}/>
          </div>
      </div>
    );
  }
}

export default Practice3;
