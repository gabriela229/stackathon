import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import calendars from './calendars';
import events from './events';


const rootReducer = combineReducers({
  calendars,
  events
});

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, logger));


export * from './calendars';
export * from './events';

