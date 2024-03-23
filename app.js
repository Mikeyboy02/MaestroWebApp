import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import session from 'express-session';
import axios from 'axios';
import exphbs from 'express-handlebars';

import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use('/public', staticDir);
app.use(express.json());
app.use(session({
  name: "maestroWebApp",
  secret: "Secret",
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 600000000}
}));
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//start middleware******************************************************************

app.use(async (req, res, next) => {
  if (req.session.user) {
    console.log("[" + new Date().toUTCString() + "]: " + req.method + " " + req.originalUrl + " (Authenticated User)")
  }
  else {
    console.log("[" + new Date().toUTCString() + "]: " + req.method + " " + req.originalUrl + " (Non-Authenticated User)")
  }
  if (req.originalUrl != '/')
    return next()
  else {
    if (req.session.user.role == 'instructor')
      return res.redirect('/instructors/calendar')
  }
  return next()
})

app.use('/login', (req, res, next) => {
  if (req.session.user)
  {
    if (req.session.user.role == 'instructor')
        return res.redirect('/instructors/calendar')
    if (req.session.user.role == 'student')
        return res.redirect('/students/dashboard')
  }
  next()
})

app.use('/register', (req, res, next) => {
  if (req.session.user)
  {
    if (req.session.user.role == 'instructor')
        return res.redirect('/instructors/calendar')
    if (req.session.user.role == 'student')
        return res.redirect('/students/dashboard')
  }
  next()
})

app.use('/instructors/calendar', (req, res, next) => {
  if (!req.session.user)
    return res.redirect('/login')
  else 
  {
    if (req.session.user.role == 'student')
        return res.redirect('/students/dashboard')
  }
  next()
})

app.use('/students/dashboard', (req, res, next) => {
  if (!req.session.user)
    return res.redirect('/login')
  else
  {
    if (req.session.user.role == 'instructor')
      return res.redirect('/instructors/calendar')
  }
  next()
})


//end middleware*********************************************************************

configRoutes(app);

import { WebSocketServer } from 'ws'
import { connect } from 'http2';
import http from 'http'

const server = http.createServer(app)
const wss = new WebSocketServer({server})

wss.on('connection', function connection(ws) {
  console.log("WS connection made")
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  })

  ws.send('This is a message')
})

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000/login');
});

//import userData from "./data/users.js";
//await userData.createUser("Josh", "Prasad", "jprasad2@stevens.edu","6034935270" ,"password123", "student");
