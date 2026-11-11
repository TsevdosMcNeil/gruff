import React from 'react';

// includes
import ScrollToTop from './ScrollToTop';

// containers
import Home from './containers/Home';
import Practice from './containers/Practice';
import People from './containers/People';
import Stories from './containers/Stories';
import StoryDetails from './containers/StoryDetails';
import Contact from './containers/Contact';
import Projects from './containers/ProjectsAll';
import ProjectsList from './containers/ProjectsList';
import ProjectDetails from './containers/ProjectDetails';
import Policy from './containers/Privacy';
import NoPage from './containers/NoPage';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

function Layout(){
	return(
		<Router >
			<main className="gruff-layout fullW">	
				<ScrollToTop/>
				<Switch>
					<Route exact path={`${process.env.PUBLIC_URL}/`} component={Home}/>
					<Route exact path={`${process.env.PUBLIC_URL}/stories`} component={Stories}/>
					<Route exact path={`${process.env.PUBLIC_URL}/story/:details`} component={StoryDetails}/>
					<Route exact path={`${process.env.PUBLIC_URL}/practice`} component={Practice}/>
					<Route exact path={`${process.env.PUBLIC_URL}/people`} component={People}/>
					<Route exact path={`${process.env.PUBLIC_URL}/projects/grid`} component={Projects}/>
					<Route exact path={`${process.env.PUBLIC_URL}/projects/list`} component={ProjectsList}/>
					<Route exact path={`${process.env.PUBLIC_URL}/project/:details`} component={ProjectDetails}/>
					<Route exact path={`${process.env.PUBLIC_URL}/contact`} component={Contact}/>
					<Route exact path={`${process.env.PUBLIC_URL}/privacy-notice`} component={Policy}/>
					<Route exact path={`*`} component={NoPage}/>
				</Switch>
			</main>
		</Router>
	)
}
export default Layout;
