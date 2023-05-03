const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// manage the users login
const handleLogin = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    // if they didnt fill out all the fields
    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    // save the user name
    window.localStorage.setItem("jk9927-UserName", username);

    helper.sendPost(e.target.action, {username, pass});

    return false;
}

// manage a new account setup
const handleSignup = (e) => {
    e.preventDefault();
    helper.hideError();

    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // if the user didnt fill out all fields
    if(!username || !pass || !pass2)
    {
        helper.handleError('All fields are required!');
        return false;
    }

    // if the passwords dont match
    if(pass !== pass2)
    {
        helper.handleError('Passwords do not match');
        return false;
    }

    helper.sendPost(e.target.action, {username, pass, pass2});

    return false;
}

// manage the login page display
const LoginWindow = (props) => {
    return (
        <form id = "loginForm"
            name = "loginForm"
            onSubmit = {handleLogin}
            action = "/login"
            method = "POST"
            className = "mainForm"
            >
                <lable htmlFor = "username">Username: </lable>
                <input id = "user" type = "text" name = "username" placeholder = "username" />
                <label htmlFor = "pass">Password: </label>
                <input id = "pass" type = "password" name = "pass" placeholder = "password" />
                <input className = "formSubmit" type = "submit" value = "Sign in" />
            </form>
    )
}

// manage the signup page display
const SignupWindow = (props) => {
    return (
        <form id = "signupForm"
            name = "signupForm"
            onSubmit = {handleSignup}
            action = "/signup"
            method = "POST"
            className = "mainForm"
            >
                <label htmlFor = "username">Username: </label>
                <input id = "user" type = "text" name = "username" placeholder = "username" />
                <label htmlFor = "pass">Password: </label>
                <input id = "pass" type = "password" name = "pass" placeholder = "password" />
                <label htmlFor = "pass2">Password: </label>
                <input id = "pass2" type = "password" name = "pass2" placeholder = "retype password" />
                <input className = "formSubmit" type = "submit" value = "Sign up" />
            </form>
    )
}

const init = () => {
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

    // if the user selects login show the login page
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<LoginWindow />, document.getElementById('content'));
        return false;
    });

    // if the user selects signup show the signup page
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        ReactDOM.render(<SignupWindow />, document.getElementById('content'));
        return false;
    });

    //start with the login page
    ReactDOM.render(<LoginWindow />, document.getElementById('content'));
}

window.onload = init;