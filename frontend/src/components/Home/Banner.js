import React from 'react';
import BannerImg from './../../assets/img/Home/b1.jpg';
import GImg from './../../assets/img/logo/logoW.svg';
import 'jquery/src/jquery';
import OwlCarousel from 'react-owl-carousel';

const owlConfig = {
  autoplay:true,
  autoplayTimeout:2500,
  autoplayHoverPause:false,
  loop:true,
  nav:false,
  dots: false,
  mouseDrag: false,
  items:1,
  animateIn: 'fadeIn',
  animateOut: 'fadeOut'
}

class Banner extends React.Component {	
  constructor(props){
    super(props);
  }

  componentDidMount(){}

  render() {
    let {data} = this.props.posts.items;
    let allOwlItems = !('home-sliders' in data) ? '' : 
    data['home-sliders'].map((banner,key) => {
      return(
        <span className="img-container" key={banner.id}><img src={banner.acf.slider_image.url} title={banner.title.rendered} alt={banner.title.rendered}/></span>
      )
    })
    return (
      <div className="gruff-HomeBanner fullW">
        {
          allOwlItems != '' &&
          <OwlCarousel className="" {...owlConfig}>                        	
            {allOwlItems}                            
          </OwlCarousel>
        } 
        <span className="gruff-CenterLogo">
            <img src={GImg} alt="" title="Gruff"/>
        </span>
      </div>
    );
  }
}

export default Banner;