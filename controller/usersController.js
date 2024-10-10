const { map } = require('bluebird');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Rol = require('../models/rol');

module.exports = {
    async getAll(req, res, next){
        try{
            const data = await User.getAll();
            console.log(`Usuarios: ${data}`);
            return res.status(201).json(data);
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            }); 

        }
    },

    async register(req, res, next){
        try{
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);// Rol por defecto (CLIENTE)

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente, ahora puedes iniciar sesión',
                data: data.id
            });

        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con el registro!',
                error: error
             
            });
        }
    },

    async login(req, res, next) {

        //Este metodo me daba error pero al cambiar la constante myuser se arregló ._.
        try {
            const email = req.body.email;
            const pw = req.body.pw;
            const myuser = await User.findByEmail(email);
    
            if (!myuser) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario o email no encontrado'
                });
            }
    
            try {
                if (User.isPwMatch(pw, myuser.pw)) {
                    const token = jwt.sign({ id: myuser.id, email: myuser.email }, keys.secretOrKey, {
                        expiresIn: (60 * 60 * 24) // una hora
                    });
                    const data = {
                        id: myuser.id,
                        name: myuser.name,
                        lastname: myuser.lastname,
                        email: myuser.email,
                        phone: myuser.phone,
                        image: myuser.image,
                        session_token: `JWT ${token}`,
                        roles: myuser.roles
                    }
                    console.log(`USUARIO ENVIADO ${data}`);
                    return res.status(201).json({
                        success: true,
                        message: 'Usuario ha sido autentificado',
                        data: data
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        message: 'La contraseña es incorrecta'
                    });
                }
            } catch (pwError) {
                console.log(`Password Match Error: ${pwError}`);
                return res.status(500).json({
                    success: false,
                    message: 'Error al verificar la contraseña',
                    error: pwError
                });
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al momento de hacer login',
                error: error
            });
        }
    }
};