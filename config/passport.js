const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const keys = require('./keys'); // Llave secreta para el token

module.exports = function (passport) {
  let opts = {};

  // Extrae el token con el esquema Bearer
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = keys.secretOrKey;

  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findByUserId(jwt_payload.id);

        if (user) {
          // Valida si el token guardado es igual al enviado
          if (user.session_token === `Bearer ${jwt_payload.token}`) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Token no válido' });
          }
        } else {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
