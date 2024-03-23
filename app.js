import express from 'express';
var app = express();
import configRoutes from './routes/index.js';
import session, { Session } from 'express-session';
import axios from 'axios';
import exphbs from 'express-handlebars';
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import { isDataView } from 'util/types';

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

//Create HTTP Server******************
//const server = http.createServer(app)
//Create Socket.IO server and attach it to HTTP server
//  *CORS: Cross-Origin Resource Sharing
//const serverPort = process.env.PORT

app.use('/public', staticDir);
app.use(express.json());
const sessionMiddleware = session({
  name: "maestroWebApp",
  secret: "Secret",
  saveUninitialized: false,
  resave: false,
  cookie: {maxAge: 600000000}
})
app.use(sessionMiddleware);
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
/*
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
*/

//end middleware*********************************************************************
//app.use(cors())
configRoutes(app);

//import userData from "./data/users.js";
//await userData.createUser("Josh", "Prasad", "jprasad2@stevens.edu","6034935270" ,"password123", "student");
const httpServer = http.createServer(app)

httpServer.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000/login', httpServer.address().port);
});

const io = new Server({httpServer}, {
  transports: ['websocket',  'polling'],
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on('connection', (socket) => {
  console.log("A user connected! " + socket.id)
  socket.on('disconnect', () => {
    console.log('disconnected')
  })

  socket.emit('message', "A user connected")

  socket.on('enterRoom', function (room) {
    socket.join(room)
  })

  socket.on('message', (msg) => {
    io.emit('message', msg)
  })

  /*
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
    io.emit('chat message', msg)
  })
  */
})


import net from 'net'
net.createConnection(3000).on("connect", function(e) {
  console.log("success")
}).on("error", function(e) {
  console.log(e)
})
/*
io.listen(8000, () => {
  console.log("Listening for websocket on http://localhost:8000")
  })
*/
//const socket = io.listen(server)

//app.set("socketio", io)

//console.log(io)

//server.listen(3000, () => {
//  console.log("Listening on http://localhost:3000")
//})
//io.engine.use(sessionMiddleware)
//io.sockets.on("listening", () => {
//  console.log("Listening on http://localhost:8000")
//})

//socket middleware***********************************************

io.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

io.use((socket, next) => {
  
})
//end socket middleware*******************************************

