const addressController = require('../controller/addressController');

const passport = require('passport');



module.exports = (app) => {
    //rutas de tipo post
   app.get('/api/address/findByUser/:id_user', passport.authenticate('jwt', {session: false}), addressController.fyndByUser);


    app.post('/api/address/create', passport.authenticate('jwt', {session: false}), addressController.create)

}