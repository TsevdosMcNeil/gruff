import React from 'react';
import {
    NavLink,
    Link
} from 'react-router-dom'


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.toggleSubmenu = this.toggleSubmenu.bind(this);
    }

    componentDidMount(){
        let path = this.getPath(2);
        if(path == 'grid' || path == 'list'){
            this.setState({
                show: true
            })
        }
    }

    toggleSubmenu = (e) => {
        this.setState({
            ...this.state,
            show: !this.state.show
        })
    }

    getPath = (num) => {
        let { pathname } = this.props.location;
        let path = '';
        let segment = pathname.split('/')[num];
        switch (segment) {
            case 'projects':
            case 'project':
                path = 'projects/list';
                break;
            case 'story':
                path = 'stories';
                break;
            default:
                path = segment;
                break;
        }
        return path;
    }

    render() {
        let { options } = this.props.options;
        let contact_number = ('contact_number' in options) ? options.contact_number : '';
        let contact_email = ('contact_email' in options) ? options.contact_email : '';
        let instagram_url = ('instagram_url' in options) ? options.instagram_url : '';
        let twitter_url = ('twitter_url' in options) ? options.twitter_url : '';
        let { handleMenuClick } = this.props;
        let { menu } = this.props.menu;
        let path = this.getPath(1);

        let gruff_menu = !('primary' in menu) ? '' : Object.keys(menu.primary).map((item, index) => {
            let slug = menu.primary[item].url.split('://')[1];
            let has_submenu = menu.primary[item].child_items.length;
            let sub_menu = menu.primary[item].child_items.map((submenu, key) => {
                let path = this.getPath(2);
                let slug = submenu.url.split('://')[1];
                let sub_slug = slug.split('/')[1];

                return (
                    <li key={key}>
                        <a href="javascript:void(0)"
                            className={path === sub_slug ? 'nav-actv' : ''}
                            onClick={handleMenuClick}
                            data-href={`${process.env.PUBLIC_URL}/${slug}`}
                        >
                            {submenu.title}
                        </a>
                    </li>
                )
            })
            return (
                <li key={item}>
                    <a href="javascript:void(0)"
                        className={path === slug && !has_submenu ? 'nav-actv' : ''}
                        onClick={!has_submenu ? handleMenuClick : this.toggleSubmenu}
                        data-href={!has_submenu ? `${process.env.PUBLIC_URL}/${slug}` : ''}
                    >
                        {menu.primary[item].title}
                    </a>
                    {
                        has_submenu > 0 && sub_menu &&
                            <ul className={[
                              "sub-menu",
                              this.state.show ? 'show' : ''
                              ].join(' ')}>
                                {sub_menu}
                            </ul>                       
                    }
                </li>
            )
        });
        //console.log(gruff_menu);
        let gruff_secondary_menu = !('secondary' in menu) ? '' : menu.secondary.map(function (item, index) {
            //let slug = item.url.split('://[url]/')[1];
            let slug = item.url.split('://')[1];
            return (
                <li key={index}><a href="javascript:void(0)" className={path === slug ? 'nav-actv' : ''} onClick={handleMenuClick} data-href={`${process.env.PUBLIC_URL}/${slug}`}>{item.title}</a></li>
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
                        <li><a href={instagram_url} target="_blank">Instagram</a></li>
                    }
                    {
                        twitter_url &&
                        <li><a href={twitter_url} target="_blank">Twitter</a></li>
                    }
                    {
                        gruff_secondary_menu && gruff_secondary_menu
                    }
                </ul>
            </nav>
        );
    }
}

export default Menu;
