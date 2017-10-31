import React, { Component } from 'react';
import Home from './Home';
import Navbar from './Navbar';
import store, {fetchCalendars} from '../store';


export default class Main extends Component {
  componentDidMount(){
    store.dispatch(fetchCalendars());
  }
  render(){
    return (
      <div>
        <Navbar />
        <Home />
      </div>
    );
  }
}
