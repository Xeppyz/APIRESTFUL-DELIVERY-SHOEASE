const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const { error } = require('console');

/*
Rutas
*/
const users = require('./routes/usersRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.disable('x-powerd-by');

app.set('port', port);

//Llamando a las rutas
users(app);

server.listen(3000, '192.168.3.39' || 'localhost', function(){
    console.log('Application nodejs' + port + 'Starts...')
});

app.get('/', (req,res)=>{
    res.send('Flutter root');
});


app.get('/test', (req,res)=>{
    res.send('Thats root of test');
});

//Try catch

app.use((err,req,res,next) =>{
console.log(err);
res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}

//200 - This means correct request
// 400 - This means the url doesn't exist 
//500 - Error intern of server