import React from 'react';

class Practice2 extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let section_two = !(page_id in data) ? '' : data[page_id].acf.section_two;
    
    if(!section_two) return [];

    let {image,background_color,text_color,text} = section_two;
    return (
      <div className="gruff-PracticeLayout layout2 fullW" style={{'backgroundImage':`url(${image.url})`}}>
          <div className="screenfluid-right">
            <div className="titlelg" style={{color:text_color}} dangerouslySetInnerHTML={{__html:text}} />
          </div>
      </div>
    );
  }
}

export default Practice2;
