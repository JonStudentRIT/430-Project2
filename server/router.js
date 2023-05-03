const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // get all of the posts for the app
  app.get('/getPosts', mid.requiresLogin, controllers.PostOut.getPosts);

  // login
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  // new account
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  // logout
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  // make a new post
  app.get('/maker', mid.requiresLogin, controllers.PostOut.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.PostOut.makePost);

  // home page
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  // 404 if the user enters a url that dosnt exist socket will disconnect 
  // and then reconnect the user to the last page they were on
  app.get('/*', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};
module.exports = router;
