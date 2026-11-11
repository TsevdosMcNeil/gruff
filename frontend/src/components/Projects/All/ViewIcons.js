import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'

class ViewIcons extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let fillColor = this.props.fillColor;
    let listfillColor = this.props.listfillColor ? this.props.listfillColor : "#817E7D";
    return (
      <div className="gruff-ViewIcons">

          {!this.props.type &&
              <span>
                <Link to={`${process.env.PUBLIC_URL}/projects/list`} className="list-view" data-title="List" style={{color:listfillColor}}>
                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="28.921px" height="21.85px" viewBox="0 0 28.921 21.85">
                      <rect y="10.218" fill={listfillColor} width="10.983" height="1.417"/>
                      <rect y="0.003" fill={listfillColor} width="10.983" height="1.417"/>
                      <rect y="20.433" fill={listfillColor} width="10.983" height="1.417"/>
                      <rect x="17.391" y="0" fill={listfillColor} width="11.53" height="21.848"/>
                    </svg>
                </Link>

                  <Link to={`${process.env.PUBLIC_URL}/projects/grid`} className="grid-view" data-title="Grid" style={{color:fillColor}}>
                  <svg version="1.1" id="Layer_1" x="0px" y="0px" width="28.92px" height="21.85px" viewBox="0 0 28.92 21.85">
                      <g>
                        <rect x="10.21" y="0.003" fill={fillColor} width="8.5" height="5.888"/>
                        <rect x="0" y="0.003" fill={fillColor} width="8.5" height="12.632"/>
                        <rect x="20.42" y="0.003" fill={fillColor} width="8.5" height="10.922"/>
                        <rect x="10.21" y="7.601" fill={fillColor} width="8.5" height="14.246"/>
                        <rect x="0" y="14.297" fill={fillColor} width="8.5" height="7.55"/>
                        <rect x="20.42" y="12.635" fill={fillColor} width="8.5" height="9.212"/>
                      </g>
                  </svg>
                  </Link>
              </span>
          }

          {this.props.type == 2 &&
            <Link to={`${process.env.PUBLIC_URL}/projects/list`} className="list-view" data-title="List" style={{color:listfillColor}}>
                <svg version="1.1" id="Layer_1" x="0px" y="0px" width="28.921px" height="21.85px" viewBox="0 0 28.921 21.85">
                  <rect y="10.218" fill={listfillColor} width="10.983" height="1.417"/>
                  <rect y="0.003" fill={listfillColor} width="10.983" height="1.417"/>
                  <rect y="20.433" fill={listfillColor} width="10.983" height="1.417"/>
                  <rect x="17.391" y="0" fill={listfillColor} width="11.53" height="21.848"/>
                </svg>
            </Link>
          }

          {this.props.type == 1 &&
            <Link to={`${process.env.PUBLIC_URL}/projects/grid`} className="grid-view" data-title="Grid" style={{color:fillColor}}>
              <svg version="1.1" id="Layer_1" x="0px" y="0px" width="28.92px" height="21.85px" viewBox="0 0 28.92 21.85">
                  <g>
                    <rect x="10.21" y="0.003" fill={fillColor} width="8.5" height="5.888"/>
                    <rect x="0" y="0.003" fill={fillColor} width="8.5" height="12.632"/>
                    <rect x="20.42" y="0.003" fill={fillColor} width="8.5" height="10.922"/>
                    <rect x="10.21" y="7.601" fill={fillColor} width="8.5" height="14.246"/>
                    <rect x="0" y="14.297" fill={fillColor} width="8.5" height="7.55"/>
                    <rect x="20.42" y="12.635" fill={fillColor} width="8.5" height="9.212"/>
                  </g>
              </svg>
            </Link>
          }  
      </div>
    );
  }
}

export default ViewIcons;
