const express = require('express')
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const { error } = require('console');
const multer = require('multer');
const admin = require('firebase-admin');
const servicesAccount = require('./serviceAccountKey.json');
const passport = require('passport');


/*
Inicializar firebase admin
*/

admin.initializeApp({
    credential: admin.credential.cert(servicesAccount)
})

const upload = multer({
    storage: multer.memoryStorage()
})

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
// Inicializa Passport
app.use(passport.initialize());
//app.use(passport.session());
require('./config/passport')(passport); // Importa la configuración de Passport

app.disable('x-powerd-by');

app.set('port', port);

//Llamando a las rutas
users(app, upload);

server.listen(3000, '192.168.1.24' || 'localhost', function(){
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