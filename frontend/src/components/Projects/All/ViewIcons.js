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
    let fillColor = 'rgb(184, 187, 179)';

    return (
      <div className="gruff-ViewIcons">

          <Link to={`${process.env.PUBLIC_URL}/projects/list`} className="list-view" data-title="List" style={{color:fillColor}}>
              <svg version="1.1" id="Layer_1" width="28.93px" height="21.848px" viewBox="-7.562 0 28.93 21.848" enableBackground="new -7.562 0 28.93 21.848">
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="44.609" y1="1.418" x2="47.444" y2="1.418"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="44.609" y1="10.926" x2="47.444" y2="10.926"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="44.609" y1="20.434" x2="47.444" y2="20.434"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="53.304" y1="1.418" x2="56.139" y2="1.418"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="53.304" y1="10.926" x2="56.139" y2="10.926"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="53.304" y1="20.434" x2="56.139" y2="20.434"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="61.999" y1="1.418" x2="64.834" y2="1.418"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="61.999" y1="10.926" x2="64.834" y2="10.926"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="61.999" y1="20.434" x2="64.834" y2="20.434"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="70.694" y1="1.418" x2="73.529" y2="1.418"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="70.694" y1="10.926" x2="73.529" y2="10.926"/>
                <line display="none" fill="none" stroke={fillColor} strokeWidth="2.835" x1="70.694" y1="20.434" x2="73.529" y2="20.434"/>
                <g>
                  <line fill="none" stroke={fillColor} strokeWidth="2.835" x1="-7.562" y1="10.926" x2="3.42" y2="10.926"/>
                  <line fill="none" stroke={fillColor} strokeWidth="2.835" x1="-7.562" y1="1.418" x2="3.42" y2="1.418"/>
                  <line fill="none" stroke={fillColor} strokeWidth="2.835" x1="-7.562" y1="20.43" x2="3.42" y2="20.43"/>
                  <rect x="9.829" fill={fillColor} width="11.53" height="21.848"/>
                </g>
              </svg>
          </Link>
          <Link to={`${process.env.PUBLIC_URL}/projects/grid`} className="grid-view" data-title="Grid" style={{color:fillColor}}>
              <svg version="1.1" id="Layer_1" width="28.925px" height="21.852px" viewBox="-7.558 0 28.925 21.852" enableBackground="new -7.558 0 28.925 21.852">
                <g>
                  <rect x="-7.558" y="0.001" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="-7.558" y="9.509" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="-7.558" y="19.016" fill={fillColor} width="2.835" height="2.836"/>
                  <rect x="1.137" y="0.001" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="1.137" y="9.509" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="1.137" y="19.016" fill={fillColor} width="2.835" height="2.836"/>
                  <rect x="9.833" y="0.001" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="9.833" y="9.509" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="9.833" y="19.016" fill={fillColor} width="2.835" height="2.836"/>
                  <rect x="18.528" y="0.001" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="18.528" y="9.509" fill={fillColor} width="2.835" height="2.835"/>
                  <rect x="18.528" y="19.016" fill={fillColor} width="2.835" height="2.836"/>
                </g>
              </svg>

          </Link>
      </div>
    );
  }
}

export default ViewIcons;