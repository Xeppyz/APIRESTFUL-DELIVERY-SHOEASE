const UserController = require('../controller/usersController');

module.exports = (app) => {

    app.get('/api/users/getAll', UserController.getAll);

    app.post('/api/users/create', UserController.register);
    
}