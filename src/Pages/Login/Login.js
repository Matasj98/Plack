import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import "../../App.css";

const Login = () => {
  const [form, setForm] = useState({
    email: null,
    password: null,
    errors: "",
    loading: false
  });

  const handleChange = e => {
    setForm(({
      ...form,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = e => {
    if (isFormValid(form)) {
      e.preventDefault();
      setForm(prev=>({ ...prev, loading: true, errors: "" }));
      firebase
        .auth()
        .signInWithEmailAndPassword(form.email, form.password)
        .then(signedUser => {
          setForm(prev=>({ ...prev, loading: false }));
        })
        .catch(err => {
          console.log(err);
          setForm(prev=>({ ...prev, loading: false, errors: err.message }));
        });
    }
  };

  const isFormValid = ({ email, password }) =>
    email && password ? true : setForm(prev=>({ ...prev, errors: "Fill all fields" }));

  const errorMessage = <Message color="red">{form.errors}</Message>;

  return (
    <Grid className="u-heigth100vh" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="red" textAlign="center">
          <Icon name="code" color="black" />
          Login to Plack
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="email"
              icon="mail"
              iconPosition="left"
              placeholder="Email-adress"
              onChange={handleChange}
              type="email"
            />
            <Form.Input
              fluid
              name="password"
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              onChange={handleChange}
              type="password"
            />
            <Button
              disabled={form.loading}
              className={form.loading ? "loading" : null}
              onClick={handleSubmit}
              color="red"
              fluid
              size="large"
            >
              Login
            </Button>
          </Segment>
        </Form>
        {form.errors.length > 0 ? errorMessage : null}
        <Message>
          Not a user? <Link to="/register">Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
