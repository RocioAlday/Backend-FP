const express= require('express');
const cookieParser= require('cookie-parser');
const morgan= require('morgan');
const routes= require('./routes');
const cors= require('cors');
const bodyParser= require("body-parser");

const server= express();
server.name= 'API';
server.use(express.json({limit: "50mb", extended: true}));
server.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}));
server.use(bodyParser.raw({ type: 'application/pdf',  limit: '50mb'}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(
  cors({
    origin: 'https://frontend-fp.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  })
);

  
server.use('/', routes);

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
