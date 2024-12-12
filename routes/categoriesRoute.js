const categoriesController = require('../controller/categoriesController');

const passport = require('passport');



module.exports = (app) => {
    //rutas de tipo post
    app.post('/api/categories/create', passport.authenticate('jwt', {session: false}), categoriesController.create);


    app.get('/api/categories/getAll', passport.authenticate('jwt', {session: false}), categoriesController.getAll)

}