import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import firebase from "./firebase";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import MainPage from "./Pages/MainPage/MainPage";
import Spinner from "./Components/Spinner/Spiner";
import { setUser } from "./Store/Actions/setUser";

class App extends React.Component {
  componentDidMount() {
    //firebase is mounted, and this function is always active
    firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        this.props.setUser(user);
        this.props.history.push("/plackApp");
      } else {
        this.props.setUser(null);
        this.props.history.push("/login");
      }
    });
  }
  render() {
    return this.props.isLoading ? (
      <Spinner />
    ) : (
      <div className="App">
        <Switch>
          <Route exact path="/plackApp" component={MainPage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

export default withRouter(connect(mapStateToProps, { setUser })(App));
