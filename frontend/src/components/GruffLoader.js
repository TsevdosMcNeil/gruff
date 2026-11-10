import React from 'react';
import BImg from './../assets/img/logo/logoB.svg';
import WImg from './../assets/img/logo/logoW.svg';

const styles = {
  container:{
    position: 'fixed',
    width: 'calc(100% - 60px)',
    height: '100%',
    left: '60px',
    top: 0,
    background: 'rgb(200, 204, 206)',
    zIndex: 9999
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  }
}

class GruffLoader extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let Logo = WImg;
    return (
      <div className="gruff-HeaderLogo fullW" style={styles.container}>
          <img src={Logo} alt="Gruff" title="Gruff" style={styles.loader} />
      </div>
    );
  }
}
export default GruffLoader;