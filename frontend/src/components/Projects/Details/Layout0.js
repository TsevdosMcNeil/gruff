import React from 'react';
import HeaderLogo from './../../HeaderLogo';
import ViewIcons from './../All/ViewIcons';

class Layout1 extends React.Component {	
  constructor(props){
    super(props);
  }
  render() { 
    let {details} = this.props;
    return (
      <section className="gruff-Layout layout0">
          <img className="fulidImg" src={details.hero_image.url} alt={details.post_title} title={details.post_title} />
          {/* <h6 className="titlehg">{details.projectName}</h6> */}
            <div className="screenfluid-left">
                <HeaderLogo whiteLogo={true} />
                <div className="projectInfo fullW">
                  <h6 className="title">{details.post_title}</h6>
                  <div className="titlelg" dangerouslySetInnerHTML={{__html:details.sub_heading}} />
              </div>
          </div>
          <div className="screenfluid-right">
              <ViewIcons fillColor={details.details_icon} listfillColor={details.details_icon} /> 
          </div>
      </section>
    );
  }
}

export default Layout1;
