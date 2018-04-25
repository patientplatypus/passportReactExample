import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Component1 from './components/Component1'


import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Router>
          <div>
             <Route exact path='/' component={Component1} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
