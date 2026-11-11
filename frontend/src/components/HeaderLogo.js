import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'
import BImg from './../assets/img/logo/logoB.svg';
import WImg from './../assets/img/logo/logoW.svg';


class HeaderLogo extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let Logo = this.props.whiteLogo ? WImg : BImg;
    return (
        <Link className="gruff-HeaderLogo" to={`${process.env.PUBLIC_URL}/`} >
            <img src={Logo} alt="Gruff" title="Gruff"/>
        </Link>
    );
  }
}
export default HeaderLogo;
