import React from 'react';

class Practice5 extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let section_five = !(page_id in data) ? '' : data[page_id].acf.section_five;
    
    if(!section_five) return [];

    let {image,background_color,text_color,text} = section_five;

    return (
      <div className="gruff-PracticeLayout layout5 fullW">
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

export default Practice5;
