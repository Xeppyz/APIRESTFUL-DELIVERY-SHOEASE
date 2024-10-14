const UserController = require('../controller/usersController');

module.exports = (app, upload) => {


    //get data
    app.get('/api/users/getAll', UserController.getAll);

    app.get('/api/users/findById/:id', UserController.findById);

    //save data
    app.post('/api/users/create', upload.array('image', 1),UserController.registerWithImage);

    app.post('/api/users/login', UserController.login);

    //UPDATE DATA

    app.put('/api/users/update', upload.array('image', 1),UserController.update);
    
}