import React from 'react';
class Member extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let elem = document.getElementById('people-section');
    if(window.innerWidth > 1200 && elem){
        let sHeight = window.innerHeight;
        let icover = document.querySelectorAll('.item-cover');
        let pHeight = elem.offsetTop;
        if(icover){
            for(let i = 0; i < icover.length; i++){
                icover[i].style.paddingTop = `${pHeight}px`;
                icover[i].childNodes[0].childNodes[0].style.height = `${(sHeight - 120) / 2}px`;
            }
        }
    }
    
    let {handleClick, members, index} = this.props;
    return (
        <div className="item" key={index} onClick={handleClick} >
            <span className="img-container fullW">
                <img src={members.member_thumbnail_image.url} title={members.post_title} alt={members.post_title}/>
            </span>
            <p className="pName fullW"><b dangerouslySetInnerHTML={{__html: members.post_title}} /></p>
            <p className="pDeg fullW" dangerouslySetInnerHTML={{__html: members.member_designation}} />
            <div className='item-cover'>
                <div className="screen-left">
                    <img src={members.member_large_image.url} title={members.post_title} alt={members.post_title}/>
                </div>
                <div className="screenfluid-right">
                    <p className="pName fullW"><b dangerouslySetInnerHTML={{__html: members.post_title}} /></p>
                    <p className="pEdu fullW" dangerouslySetInnerHTML={{__html: members.member_designation}} />
                    <div className="people-dtls fullW" dangerouslySetInnerHTML={{__html: members.member_description}} />
                </div>
            </div>
        </div>
    );
  }
}

export default Member;
