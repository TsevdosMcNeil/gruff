import React, { Component, PropTypes } from 'react';

class ScrollToTop extends Component {
    componentDidUpdate(prevProps) {
		if(window.location.hash){
			var e = document.getElementById(window.location.hash.split('#')[1]);
			if (!!e && e.scrollIntoView) {
				e.scrollIntoView();
				window.scrollBy(0, -80);
			}
		}else{
	    	window.scrollTo(0, 0)
		}
	}
	componentDidMount(prevProps) {
		if(window.location.hash){
			var e = document.getElementById(window.location.hash.split('#')[1]);
			if (!!e && e.scrollIntoView) {
				e.scrollIntoView();
				window.scrollBy(0, -80);
			}
		}else{
	    	window.scrollTo(0, 0)
		}
	}

	render() {
	    return null
	}
}

export default ScrollToTop;
