import React from 'react';
import HeaderLogo from './../../HeaderLogo';

class Layout1 extends React.Component {	
  constructor(props){
    super(props);
  }
  render() { 
    let {details} = this.props;
    return (
      <div className="gruff-Layout layout1 fullW">
          <HeaderLogo whiteLogo={true}/>
          <div className="content-container">
              <h6 className="title fullW">{details.post_title}</h6>
              <div className="title fullW" dangerouslySetInnerHTML={{__html:details.sub_heading}} />
          </div>
          <div className="img-container">
            <img src={details.hero_image.url} alt={details.post_title} title={details.post_title} />
          </div>
      </div>
    );
  }
}

export default Layout1;