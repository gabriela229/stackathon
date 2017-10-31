import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import calendars from './calendars';

const rootReducer = combineReducers({
  calendars
});

export default createStore(rootReducer, applyMiddleware(thunkMiddleware, logger));


export * from './calendars';

