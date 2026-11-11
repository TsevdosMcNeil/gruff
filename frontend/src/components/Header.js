import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'
import Menu from './Menu';
import GruffLoader from './GruffLoader';
import HeaderLogo from './HeaderLogo';
import {toggleMenu} from "./../actions/menuActionCreators";
import { showLoader } from '../actions/transitionActionCreators';

class Header extends React.Component {	
    constructor(props){
        super(props);
        this.handleClick        = this.handleClick.bind(this);
        this.toggleMenuClass    = this.toggleMenuClass.bind(this);
        this.handleMenuClick    = this.handleMenuClick.bind(this);
    }

    componentDidMount(){
        let {menu}              = this.props;

        window.addEventListener( "pageshow", function ( event ) {
            var historyTraversal = event.persisted || 
                                   ( typeof window.performance != "undefined" && 
                                        window.performance.navigation.type === 2 );
            if ( historyTraversal ) {
              // Handle page restore.
              window.location.reload();
            }
        });
    }

    handleClick = (e) => {
        let {menu}              = this.props;
        let currentClass        = e.currentTarget.className;
        let newClass            = currentClass == 'hammenu' ? 'gruff-Header is-open' : 'gruff-Header';  
        let newHandlarClass     = currentClass == 'hammenu' ? 'hammenu is-actv' : 'hammenu';  
        this.toggleMenuClass(newClass,newHandlarClass);
    }

    toggleMenuClass = (newClass,newHandlarClass) => {
        document.querySelector('#header-menu').setAttribute('class',newClass);
        document.querySelector('#header-menu').childNodes[0].setAttribute('class',newHandlarClass);
    }

    handleMenuClick = (e) => { 
        let _this               = this;
        let url                 = e.currentTarget.getAttribute('data-href');
        _this.toggleMenuClass('gruff-Header','hammenu');
        setTimeout(() => {
            _this.props.history.push(url);
        },250)
    }

    render() {
        let {options}   = this.props.options;
        let {menu}      = this.props.menu;
        let copyright   = !(copyright in options) ? options.copyright : '';
        return (
            <header className='gruff-Header' id="header-menu">
                <a href="javascript:" className='hammenu' onClick={this.handleClick}>
                    <span></span>
                    <b></b>
                </a>
                <div className="gruff-HeaderContent">
                    <HeaderLogo {...this.props} />
                    <Menu {...this.props} handleMenuClick={this.handleMenuClick} />
                    {copyright &&
                        <div className="fullW" dangerouslySetInnerHTML={{__html:copyright}} />
                    }
                </div>
            </header>
        );
    }
}

export default Header;
