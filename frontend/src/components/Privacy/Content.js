import React from 'react';
import HeaderLogo from './../HeaderLogo';

class Content extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let data = this.props.pages.pageData;
    let page_id = this.props.page_id;
    let pageData = !(page_id in data) ? '' : data[page_id];
    if(!pageData) return [];
    return (
        <div className="gruff-PrivacyLayout fullW">
            <HeaderLogo/>
            <div className="gruff-PrivacyContent" dangerouslySetInnerHTML={{__html:pageData.content.rendered}} />
        </div>
    );
  }
}

export default Content;
