import React from 'react';
import {
  NavLink,
  Link
} from 'react-router-dom'
import BannerImg from './../../assets/img/Home/b1.jpg';
import GImg from './../../assets/img/logo/logoW.svg';
import 'jquery/src/jquery';
import OwlCarousel from 'react-owl-carousel2';


const owlConfig = {
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:false,
  loop:true,
  nav:false,
  dots: false,
  touchDrag: false,
  mouseDrag: false,
  items:1,
  animateIn: 'fadeIn',
  animateOut: 'fadeOut'
}


class Banner extends React.Component {	
  constructor(props){
    super(props);
  }

  componentDidMount(){
      let home = document.getElementById('home-area');
      let menu = document.getElementById('header-menu');
      home.addEventListener("mousemove", function() {
        menu.classList.add("hover-effect");
      });

      setInterval(function(){
        menu.classList.remove("hover-effect");
      }, 401);
  }

  render() {
    let {data} = this.props.posts.items;
    let allOwlItems = !('home-sliders' in data) ? '' : 
    data['home-sliders'].map((banner,key) => {
      return(
        <a href={banner.acf.url} className="img-container" key={banner.id}><img src={banner.acf.slider_image.url} title={banner.title.rendered} alt={banner.title.rendered}/></a>
      )
    })
    return (
      <div className="gruff-HomeBanner fullW" id="home-area">
        {
          allOwlItems != '' &&
          <OwlCarousel className="owl-carousel" options={owlConfig}>                        	
            {allOwlItems}                            
          </OwlCarousel>
        } 
        <span className="gruff-CenterLogo">
            <img src={GImg} alt="Gruff" title="Gruff"/>
        </span>
      </div>
    );
  }
}

export default Banner;
