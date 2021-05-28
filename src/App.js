import React, { Component } from 'react';
import Login from "./screens/login/Login";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
    return (
      <>
        <Router>
          <Switch>
            <Route path="/" component={Login}/>
          </Switch>
        </Router>
      </>
    );
  }

export default App;
