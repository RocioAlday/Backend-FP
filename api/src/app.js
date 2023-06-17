const express= require('express');
const cookieParser= require('cookie-parser');
const morgan= require('morgan');
const routes= require('./routes');
const cors= require('cors');

const server= express();
server.name= 'API';
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cookieParser());
server.use(morgan('dev'));
server.use(
    cors({
        origin: "*"
    })
);
server.use((req, res, next)=> {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });
  
server.use('/', routes);

server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
