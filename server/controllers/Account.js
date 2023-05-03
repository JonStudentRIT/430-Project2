// get the account model
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

// logout and end the session
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// login and verify that the accout and the password are correct
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // if they left a field blank
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // if they didnt use the right password for the username
  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    // create the sesion
    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// create a new account
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  // if they dont fill in all the fields
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // if the passwords that they entered dont match for some reason
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // create a new account with that user name and encrypt the password
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
};
