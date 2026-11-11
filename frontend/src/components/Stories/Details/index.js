import React from 'react';
import Header from '../../Header'
import GruffLoader from './../../GruffLoader'
import Layout0 from './Layout0';
import RecentProjects from './../../Projects/All/Recent';
import ReactFullpage from '@fullpage/react-fullpage';
import {fetchMenu} from "./../../../actions/menuActionCreators";
import {fetchOptions} from "./../../../actions/optionActionCreators";
import {fetchProjects} from "./../../../actions/projectActionCreators";
import {fetchStories} from "./../../../actions/storyActionCreators";
import {showLoader, hideLoader} from '../../../actions/transitionActionCreators';
import {NavLink, Link} from 'react-router-dom'

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.goToSection = this
      .goToSection
      .bind(this);
    this
      .props
      .dispatch(showLoader());
  }
  componentDidMount() {
    Promise.all([
      this.props.dispatch(fetchMenu('menu')),
      this.props.dispatch(fetchOptions()),
      this.props.dispatch(fetchStories()),
      this.props.dispatch(fetchProjects())
    ]).then(() => {
      this.props.dispatch(hideLoader())
    });
  }
  goToSection = (section) => {
    let actvElmnt = document.querySelector(`.${section}`).offsetTop;
    window.scrollTo(0, actvElmnt);
  }


  render() {
    let stories = this.props.stories.all;
    let details_slug = this.props.match.params.details;
    let storyDetails = stories.filter((single) => {
      return single.post_name == details_slug;
    });

    if (storyDetails[0] === undefined) return [];

    const Fullpage = () => (
      <ReactFullpage
        licenseKey={process.env.REACT_APP_FULLPAGE_LICENSE}
        responsiveWidth={1201}
        responsiveHeight={650}
        fitToSection={false}
        autoScrolling={false}
        render={({ state, fullpageApi }) => {
          let layoutData = storyDetails[0].layout.map((row, index) => {
            console.log(row);
            return (
              <div className="gruff-StoriesInner fullW" dangerouslySetInnerHTML={{__html:row}} key={index} />          
            )
          })
          return (
            <ReactFullpage.Wrapper>
              <div className="section fp-auto-height">
                <Layout0  details={storyDetails[0]} {...this.props} />
                <a href="javascript:" className="btn-scrollDown" onClick={() => fullpageApi.moveSectionDown()}><span></span></a>
              </div>
              <div className="section">
                  <div className="otherSections fullW">{layoutData}</div>
                  <div className="recent-project-section">
                    <div className="btn-container">
                      <NavLink to={`${process.env.PUBLIC_URL}/stories`} className="btn-leftarrow">Back to Stories</NavLink>
                      <a href="javascript:"  onClick={() => fullpageApi.moveTo(1)} className="btn-toparrow"><span>Back to </span>Top</a>
                    </div>
                    <RecentProjects {...this.props}/>
                  </div>
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    );

    {
      this.props.loader.gruffLoader.isLoading && <GruffLoader/>
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
