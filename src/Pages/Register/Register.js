import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from "md5";
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

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    errors: "",
    loading: false,
    usersRef: firebase.database().ref("users")
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const isFormValid = () => {
    if (!formIsNotEmpty(form)) {
      setForm({ ...form, errors: "Fill all fields" });
      return false;
    } else if (!passwordsMatch(form)) {
      setForm({
        ...form,
        errors: "Passwords do not match or password to short"
      });
      return false;
    } else return true;
  };

  const formIsNotEmpty = ({ username, password, email }) => {
    return username.length && password.length && email.length > 0;
  };

  const passwordsMatch = ({ password, passwordConfirm }) => {
    return password === passwordConfirm && password.length >= 6;
  };

  const handleSubmit = e => {
    if (isFormValid()) {
      e.preventDefault();
      setForm({ ...form, loading: true, errors: "" });
      firebase
        .auth()
        .createUserWithEmailAndPassword(form.email, form.password)
        .then(createdUser => {
          createdUser.user
            .updateProfile({
              displayName: form.username,
              photoURL: `https://www.gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(createdUser);
            })
            .catch(err => {
              console.log(err);
              setForm({ ...form, loading: false, errors: err.message });
            });
        })
        .catch(err => {
          setForm({ ...form, loading: false, errors: err.message });
          console.log(err);
        });
    }
  };

  const saveUser = createdUser => {
    return form.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  const errorMessage = <Message color="red">{form.errors}</Message>;

  return (
    <Grid className="u-heigth100vh" textAlign="center" verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="red" textAlign="center">
          <Icon name="code" color="black" />
          Register for Plack
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              name="username"
              icon="user"
              iconPosition="left"
              placeholder="Username"
              onChange={handleChange}
              type="text"
            />
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
            <Form.Input
              fluid
              name="passwordConfirm"
              icon="repeat"
              iconPosition="left"
              placeholder="Repeat password"
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
              Submit
            </Button>
          </Segment>
        </Form>
        {form.errors.length > 0 ? errorMessage : null}
        <Message>
          Already a user? <Link to="/login">Login</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
