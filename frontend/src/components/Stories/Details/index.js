import React from 'react';
import Header from '../../Header'
import GruffLoader from './../../GruffLoader'
import Layout1 from './Layout1'
import ReactFullpage from '@fullpage/react-fullpage';
import { fetchMenu} from "./../../../actions/menuActionCreators";
import { fetchOptions } from "./../../../actions/optionActionCreators";
import { fetchProjects } from "./../../../actions/projectActionCreators";
import { fetchStories } from "./../../../actions/storyActionCreators";

class Index extends React.Component {	
  constructor(props){
    super(props);
    this.state = {
      pageLoading:true
    }
    console.log(1)
  }
  componentDidMount(){
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchStories()),
    ]).then(() => {
      this.setState({
        pageLoading:false
      })
    });
  }

  render() {
    let stories = this.props.stories.data;
    let details_slug  = this.props.match.params.details;
    let storyDetails   = stories.map((set,index) => {
      return(
        set.filter((item) => {
          return item.post_name == details_slug;
        })
      )
    });
    if(storyDetails[0] === undefined) return [];

    let layoutData = storyDetails[0][0].layout.map((row, index) => {
      return <div className="section" dangerouslySetInnerHTML={{__html:row}} />
    })

    const Fullpage = () => (
      <ReactFullpage
        render={({ state, fullpageApi }) => {
          return (
            <ReactFullpage.Wrapper>
              <div className="section"><Layout1  details={storyDetails[0][0]} {...this.props} /><a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a></div>
              {layoutData}
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );
    {this.state.pageLoading &&
      <GruffLoader />
    } 
    return (
      <div className="gruff--StoryDetails fullW">
          <Header {...this.props} />
          <Fullpage  {...this.props} />
      </div>
    );
  }
}

export default Index;