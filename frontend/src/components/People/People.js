import React from 'react';
import Member from './Member';

class People extends React.Component {	
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (e) => {
        let _this       = this;
        let currentElem = e.currentTarget;
        let elems       = document.querySelectorAll('.is-showing');
        Array.from(elems).forEach((elem) => {
            if(elem != currentElem){
                elem.classList.remove('is-showing');
                _this.slideUp(elem.querySelector('.item-cover'));
            }    
        })
        let elemIndex   = [...currentElem.parentNode.childNodes].indexOf(currentElem);
        const perRow    = 4;
        let pos         = (elemIndex % perRow);
        let leftPos     = pos > 0 ? `calc(-${pos}*100% - 60px)`:'-60px';
        let contentElem = currentElem.querySelector('.item-cover');
        let contentElemHeight = currentElem.querySelector('.item-cover').offsetHeight;
        let root = document.getElementsByTagName( 'html' )[0];

        if(currentElem.classList.contains('is-showing')){
            currentElem.classList.remove('is-showing');
            currentElem.parentElement.parentElement.parentElement.classList.remove('has-is-showing');
            document.querySelector('.gruff-Header').classList.remove('gruff-HeaderOpac');
            root.classList.remove('auto-scroll');
            //this.slideUp(currentElem,contentElem);
            //document.getElementsByClassName("item").style.marginBottom = '0px';
        }else{
            currentElem.classList.add('is-showing');
            currentElem.parentElement.parentElement.parentElement.classList.add('has-is-showing');
            document.querySelector('.gruff-Header').classList.add('gruff-HeaderOpac');
            root.classList.add('auto-scroll');
            //this.slideDown(currentElem,contentElem,leftPos,contentElemHeight);
        }

    }

  render() {
      
    let _this = this;  
    let {people} = this.props;

    const allMembers = !(people.data.length) ? [] : 
    people.data.map((members,index) => {
        return(
            <Member {...this.props} members={members}  handleClick={_this.handleClick} key={index} />
        )
    })
    
    return (
        <div className="gruff-People fullW">
            <div className="gruff-PeopleRow fullW">
                <div id="people-section" className="gruff-PeopleCol gruff-allPeople fullW">
                    {allMembers}
                </div>
            </div>
        </div>
    );
  }
}

export default People;
