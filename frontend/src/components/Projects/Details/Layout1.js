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
          <img className="fulidImg" src={details.hero_image.url} alt={details.post_title} title={details.post_title} />
          {/* <h6 className="titlehg">{details.projectName}</h6> */}
            <div className="screenfluid-left">
                <HeaderLogo whiteLogo={true} />
                <div className="projectInfo fullW">
                  <h6 className="title">{details.post_title}</h6>
                  <div className="titlelg" dangerouslySetInnerHTML={{__html:details.sub_heading}} />
              </div>
            
          </div>
      </div>
    );
  }
}

export default Layout1;