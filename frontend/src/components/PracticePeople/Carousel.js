import React from 'react';
import 'jquery/src/jquery';
import OwlCarousel from 'react-owl-carousel';
import GImg from './../../assets/img/logo/logoW.svg';

const owlConfig = {
  autoplay:true,
  autoplayTimeout:2500,
  autoplayHoverPause:false,
  loop:false,
  nav:false,
  dots: false,
  mouseDrag: false,
  items:1,
  animateIn: 'fadeIn',
  animateOut: 'fadeOut'
}

class Carousel extends React.Component {	
  constructor(props){
    super(props);
  }
  render() {
    let {data} = this.props.posts.items;
    let {slider_name} = this.props;

    let allOwlItems = !(slider_name in data) ? '' : 
      data[slider_name].map((banner,key) => {
        return(
          <span className="img-container" key={banner.id}><img src={banner.acf.image.url} title={banner.title.rendered} alt={banner.title.rendered}/></span>
        )
    })

    return (
      
      <section className="gruff-PPCarousel fullW">
          {
            allOwlItems != '' &&
              <OwlCarousel className="" {...owlConfig}>                        	
                {allOwlItems}                            
              </OwlCarousel>
          } 
          <span className="gruff-CenterLogo">
              <img src={GImg} alt="" title="Gruff"/>
          </span>
      </section>
    );
      
  }
}

export default Carousel;