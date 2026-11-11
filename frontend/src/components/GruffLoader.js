import React from 'react';
import BImg from './../assets/img/logo/logoB.svg';
import WImg from './../assets/img/logo/logoW.svg';


class GruffLoader extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let wLogo = WImg;
    let bLogo = BImg;
    return (
      <div className="gruff-HeaderLogo gruff-Loader fullW">
          {/* <span><img src={bLogo} alt="Gruff" title="Gruff"/></span> */}
          {/* <img src={wLogo} alt="Gruff" title="Gruff"/> */}
          <div id="loader"></div>
      </div>
    );
  }
}
export default GruffLoader;
