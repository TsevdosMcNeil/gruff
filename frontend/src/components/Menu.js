import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'


class Menu extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let {options} = this.props.options;
    let contact_number  = !(contact_number in options) ? options.contact_number : '';
    let contact_email   = !(contact_email in options) ? options.contact_email : '';
    let instagram_url   = !(instagram_url in options) ? options.instagram_url : '';
    let twitter_url     = !(twitter_url in options) ? options.twitter_url : '';

    let {menu} = this.props.menu;
    let gruff_menu = menu.map(function(item,index){
      let slug = item.url.replace('http://','');
      return(
        <li key={index}><NavLink activeClassName="nav-actv" exact to={`${process.env.PUBLIC_URL}/${slug}`}>{item.title}</NavLink></li>
      )
    })
    return (
      <nav className="gruff-nav">
        {gruff_menu &&
          <ul className="gruff-menu">
              {gruff_menu}
          </ul>
        }
        <ul className="gruff-Cinfo">
          {
            contact_number &&
              <li><a href={`tel:${contact_number}`}>{contact_number}</a></li>
          }
          {
            contact_email &&
              <li><a href={`mailto:${contact_email}`}>{contact_email}</a></li>
          }
          {
            instagram_url &&
              <li><a href={instagram_url}>Instagram</a></li>
          }
          {
            twitter_url &&
              <li><a href={twitter_url}>Twitter</a></li>
          }
        </ul>
      </nav>
    );
  }
}

export default Menu;