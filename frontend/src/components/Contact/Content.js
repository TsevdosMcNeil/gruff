import React from 'react';
import RecentProjects from '../Projects/All/Recent';
import { fetchPage } from "./../../actions/pageActionCreators";
class Content extends React.Component {	
  render() {
    let data            = this.props.pages.pageData;
    let page_id         = this.props.page_id;
    let {options}       = this.props.options;
    let office_address  = !(office_address in options) ? options.office_address : '';
    let office_details  = !(office_details in options) ? options.office_details : '';
    let contact_number  = !(contact_number in options) ? options.contact_number : '';
    let contact_email   = !(contact_email in options) ? options.contact_email : '';

    return (
      <div className="gruff-Content fullW">
        <div className="fullW">
          <div className="screen-left">
            <div className="fullW" dangerouslySetInnerHTML={{__html: office_details}} />
          </div>
          <div className="screen-right">
            <div className="fullW" dangerouslySetInnerHTML={{__html: office_address}} />
            <ul className="gruff-Cinfo fulLW">
              {
                contact_number &&
                  <li><a href={`tel:${contact_number}`}>{contact_number}</a></li>
              }
              {
                contact_email &&
                  <li><a href={`mailto:${contact_email}`}>{contact_email}</a></li>
              }
            </ul>
          </div>
        </div>  
        <RecentProjects {...this.props}/>
      </div>
    );
  }
}

export default Content;