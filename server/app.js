require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

const router = require('./router.js');

// socket setup
const socketSetup = require('./io.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// mongo setup
// key: Project2, collections: accounts, posts
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://jk9927:S4mVxyzHm9LqpJdU@cluster0.mcyfvky.mongodb.net/Project2?retryWrites=true&w=majority';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});
const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// express setup
const app = express();

// redis setup
redisClient.connect().then(() => {
  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
  app.use(favicon(`${__dirname}/../hosted/img/placeHold4.png`));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // session management
  app.use(session({
    key: 'sessionid',
    store: new RedisStore({
      client: redisClient,
    }),
    secret: 'Posting app',
    resave: false,
    saveUninitialized: false,
  }));

  // handelbar setup
  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  router(app);
});
// server is connected to express
const server = socketSetup(app);
// server started here
server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
