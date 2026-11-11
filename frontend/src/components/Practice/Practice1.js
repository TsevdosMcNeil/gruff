import React from 'react';
import HeaderLogo from './../HeaderLogo';

class Practice1 extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let section_one = !(page_id in data) ? '' : data[page_id].acf.section_one;
    
    if(!section_one) return [];

    let {image,background_color,text_color,text} = section_one;
    return (
      <div className="gruff-PracticeLayout layout1 fullW">
        <div className="screenfluid-left" style={{'backgroundColor':background_color}}>
        <HeaderLogo whiteLogo={true} />
            <div className="titlelg" style={{color:text_color}} dangerouslySetInnerHTML={{__html:text}} />
        </div>
        <div className="screenfluid-right">
          <img src={image.url} title={image.title} alt={image.alt}/>
        </div>
      </div>
    );
  }
}

export default Practice1;
