import React from 'react';
class Member extends React.Component {	
  constructor(props){
    super(props);
  }

  render() {
    let {handleClick, members, index} = this.props;
    return (
        <div className="item" key={index} onClick={handleClick} >
            <span className="img-container fullW">
                <img src={members.member_thumbnail_image.url} title={members.post_title} alt={members.post_title}/>
            </span>
            <p className="pName fullW"><b dangerouslySetInnerHTML={{__html: members.post_title}} /></p>
            <p className="pDeg fullW" dangerouslySetInnerHTML={{__html: members.member_designation}} />
            <div className='item-cover'>
                <div className="screenfluid-left">
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