import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { allReducer } from "./Store/Reducers/index";
import Thunk from "redux-thunk";
// import logger from "redux-logger";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import "semantic-ui-css/semantic.min.css";
import './index.css'

const store = createStore(allReducer, applyMiddleware(Thunk));

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  document.getElementById("root")
);
