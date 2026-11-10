import React from 'react';
class About extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let description = !(page_id in data) ? '' : data[page_id].acf.description;
    return (
      <div className="gruff-PPContent fullW" dangerouslySetInnerHTML={{__html: description}} />
    );
  }
}

export default About;