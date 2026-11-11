import {combineReducers} from 'redux';
import posts from './posts';
import pages from './pages';
import menu from './menu';
import options from './options';
import projects from './projects';
import projectTransitions from './project-transitions';
import people from './people';
import stories from './stories';
import testimonial from './testimonial';
import awards from './awards';
import loader from './loader';

export const rootReducer = combineReducers({posts, pages, menu, options, projects, projectTransitions, people, stories, testimonial, awards, loader});
