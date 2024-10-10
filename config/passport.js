const JwtStrategy = require('passport-jwt').JwtStrategy
const ExtrackJwt = require('passport-jwt').ExtrackJwt;
const User = require('../models/user');
const keys = require('./keys');
//configurando el JWT SACADO DE LA DOCUMENTACIÓN
module.exports = function(passport){
    let opts = {}
    opts.jwtFromRequest = ExtrackJwt.FromOutHeaderWihScheme('jwt');
    opts.secretOrKey = keys.secretOrKey;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) =>{
        User.findById(jwt_payload.id, (err, user)=>{
            if(err){
                return done (err, false);
            }
            if(user){
                return done (null, user);
            }
            else{
                return done (null, false);
            }
        })
    }))
}