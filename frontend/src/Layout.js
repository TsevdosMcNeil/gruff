import React from 'react';

// includes
import ScrollToTop from './ScrollToTop';

// containers
import Home from './containers/Home';
import PracticePeople from './containers/PracticePeople';
import Stories from './containers/Stories';
import StoryDetails from './containers/StoryDetails';
import Contact from './containers/Contact';
import Projects from './containers/ProjectsAll';
import ProjectsList from './containers/ProjectsList';
import ProjectDetails from './containers/ProjectDetails';

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
					<Route exact path={`${process.env.PUBLIC_URL}/practice-people`} component={PracticePeople}/>
					<Route exact path={`${process.env.PUBLIC_URL}/projects/grid`} component={Projects}/>
					<Route exact path={`${process.env.PUBLIC_URL}/projects/list`} component={ProjectsList}/>
					<Route exact path={`${process.env.PUBLIC_URL}/project/:details`} component={ProjectDetails}/>
					<Route exact path={`${process.env.PUBLIC_URL}/contact`} component={Contact}/>
				</Switch>
			</main>
		</Router>
	)
}
export default Layout;