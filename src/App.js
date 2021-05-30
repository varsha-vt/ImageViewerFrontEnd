import React, { Component } from "react";
import Home from "./screens/home/Home"
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./screens/login/Login";
import Profile from "./screens/profile/Profile";

class App extends Component {
  constructor() {
    super();
    this.baseUrl = "https://graph.instagram.com/";
  }
  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path="/" render={(props) => <Login {...props} baseUrl={this.baseUrl} />}/>
          <Route exact path="/home" render={({ history }, props) => (<Home history={history} {...props} baseUrl={this.baseUrl} />)}/>
          <Route exact path="/profile" render={({ history }, props) => (<Profile history={history} {...props} baseUrl={this.baseUrl} />)}/>
        </div>
      </Router>
    );
  }
}

export default App;
