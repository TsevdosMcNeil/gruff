import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'
import Menu from './Menu';
import HeaderLogo from './HeaderLogo';
import {toggleMenu} from "./../actions/menuActionCreators";

class Header extends React.Component {	
    constructor(props){
        super(props);
        this.handleClick    = this.handleClick.bind(this);
        this.menuCommon     = this.menuCommon.bind(this);
    }

    componentDidMount(){
        let {menu}              = this.props;
        this.menuCommon();

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

    menuCommon(){
        let newClass            = 'gruff-Header';  
        let newHandlarClass     = 'hammenu';  
        setTimeout(() => {
            this.props.dispatch(toggleMenu({targetClass:newClass, handlarClass:newHandlarClass}));
        },100)
    }

    handleClick = () => {
        let {menu}              = this.props;
        let currentClass        = menu.targetClass;
        let currentHandlarClass = menu.handlarClass;
        let newClass            = currentClass == 'gruff-Header' ?  'gruff-Header is-open' : 'gruff-Header';  
        let newHandlarClass     = currentHandlarClass == 'hammenu' ?  'hammenu is-actv' : 'hammenu';  
        this.props.dispatch(toggleMenu({targetClass:newClass, handlarClass:newHandlarClass}));
    }

    render() {
        let {options}   = this.props.options;
        let {menu}      = this.props.menu;
        let copyright   = !(copyright in options) ? options.copyright : '';
        return (
            <header className={this.props.menu.targetClass}>
                <a href="javascript:" className={this.props.menu.handlarClass} onClick={this.handleClick}>
                    <span></span>
                </a>
                <div className="gruff-HeaderContent">
                    <HeaderLogo {...this.props} />
                    <Menu {...this.props} />
                    {copyright &&
                        <div className="fullW" dangerouslySetInnerHTML={{__html:copyright}} />
                    }
                </div>
            </header>
        );
    }
}

export default Header;