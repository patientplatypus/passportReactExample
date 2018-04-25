import React, { Component } from 'react';
import axios from "axios";
import renderIf from "render-if";

class Component1 extends Component {
  constructor(props){
    super(props);
    this.state = {
      redirectHTML: null
    }
  }

  routeHandler(route){
    console.log('in routeHandler');
    axios.get(route)
    .then(response=>{
      this.setState({
        redirectHTML: response.data
      })
    })
    .catch(error=>{
      console.log('in axios error: ', error);
    })
  }
  createMarkup() {
    if (this.state.redirectHTML!=null){
      return {__html: this.state.redirectHTML};
    }
  };

  render() {
    return (
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
        <div dangerouslySetInnerHTML={this.createMarkup()} />
      </div>
    );
  }
}

export default Component1;
