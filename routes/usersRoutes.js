const UserController = require('../controller/usersController');
const passport = require('passport');

module.exports = (app, upload) => {


    //get data
    app.get('/api/users/getAll', UserController.getAll);

    app.get('/api/users/findById/:id', passport.authenticate('jwt', { session: false }), UserController.findById);

    //save data
    app.post('/api/users/create', upload.array('image', 1),UserController.registerWithImage);

    app.post('/api/users/login', UserController.login);

    app.post('/api/users/logout', UserController.logout);

    //UPDATE DATA

    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UserController.update);

    
}