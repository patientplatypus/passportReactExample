import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {}
  }

  routeHandler(route){
    console.log('in routeHandler');
    axios.get(route)
    .then(response=>{
      console.log('in axios response: ', response.data);
      const url = '/private';
      window.opener.open(url, '_self');
      window.opener.focus();
      window.close();
    })
    .catch(error=>{
      console.log('in axios error: ', error);
    })
  }

  render() {
    return (
      <div className="App">
        <div>
          <h1>
            Pick your route
          </h1>

          <button onClick={()=>{this.routeHandler("https://localhost:8000/doctorRoute")}}>Doctor Route</button>
          <br/>

          <button onClick={()=>{this.routeHandler("https://localhost:8000/pharmacistRoute")}}>Pharmacist Route</button>
          <br/>

          <button onClick={()=>{this.routeHandler("https://localhost:8000/insuranceRoute")}}>Insurance Route</button>
          <br/>
        </div>
      </div>
    );
  }
}

export default App;
