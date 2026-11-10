import React from 'react';
import Header from '../Header';
import GruffLoader from './../GruffLoader'
import Carousel from './../PracticePeople/Carousel';
import About from './../PracticePeople/About';
import People from './../PracticePeople/People';
import Contact from './Content';
import { fetchPosts } from "./../../actions/postActionCreators";
import { fetchPage } from "./../../actions/pageActionCreators";
import { fetchPeople } from "./../../actions/peopleActionCreators";
import { fetchMenu} from "./../../actions/menuActionCreators";
import { fetchOptions } from "./../../actions/optionActionCreators";
import { fetchProjects } from "./../../actions/projectActionCreators";
import ReactFullpage from '@fullpage/react-fullpage';

const page_id = '19';
const page_id2 = '50';
const slider_name = 'team-sliders';
const directors   = 'team-members?categories=2';
const others      = 'team-members?categories=3';

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.state = {
      pageLoading:true
    }
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchProjects()),
      this.props.dispatch(fetchPage(page_id)),
      this.props.dispatch(fetchPage(page_id2)),
      this.props.dispatch(fetchPosts(slider_name)),
      this.props.dispatch(fetchPeople(directors)),
      this.props.dispatch(fetchPeople(others))
    ]).then(() => {
      this.setState({
        pageLoading:false
      })
    });
  }
  
  render() {
    let _this = this;
    const Fullpage = () => (
      <ReactFullpage
        scrollOverflow={true}
        normalScrollElements= '.people'
        render={({ ...state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section"><Carousel {...this.props} slider_name={slider_name} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              <div className="section"><About {...this.props} page_id={page_id} /></div>
              <div className="section people"><People {...this.props} directors={directors} others={others} />
                <a href="javascript:" className="btn-scrollUp" onClick={() => fullpageApi.moveSectionUp()}><span></span></a>
                <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a>
              </div>
              <div className="section active gruff--Contact fullW"><Contact {...this.props}  page_id={page_id2}/></div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    return (
      <div className="gruff--Practice-People fullW">
        {this.state.pageLoading &&
          <GruffLoader />
        } 
        <Header {...this.props}/>
        <Fullpage {...this.props} />
      </div>
    );
  }
}

export default Index;