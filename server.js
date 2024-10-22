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
const session = require('express-session');
const passport = require('passport');
const keys = require('./config/keys'); 


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

// Configura express-session
app.use(session({
    secret: keys.secretOrKey, // Llave secreta para firmar la sesión
    resave: false, // Evita guardar la sesión si no ha sido modificada
    saveUninitialized: false, // No guarda sesiones vacías
    cookie: { secure: false } // Debe estar en `true` si usas HTTPS en producción
  }));
// Inicializa Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // Importa la configuración de Passport

app.disable('x-powerd-by');

app.set('port', port);

//Llamando a las rutas
users(app, upload);

server.listen(3000, '192.168.1.20' || 'localhost', function(){
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