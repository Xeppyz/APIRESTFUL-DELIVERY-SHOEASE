const { map } = require('bluebird');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Rol = require('../models/rol');
const storage = require('../utils/cloud_storage');

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

    
    async findById(req, res, next){
        try{
            const id = req.params.id;

            const data = await User.findByUserId(id);
            console.log(`Usuario: ${data}`);
            return res.status(201).json(data);
        }catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener usuario por ID'
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

 
    async registerWithImage(req, res, next){
        try{
            const user = JSON.parse(req.body.user);
            console.log(`Datos enviados del usuario:${user}`);

            const files = req.files;
            
            if(files.length > 0){
                const pathImage = `image_${Date.now()}`; //NAME FILE
                const url = await storage(files[0], pathImage);

                if(url != undefined && url != null){
                    user.image = url;
                }
            }

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

    async update(req, res, next) {
        try {
          const user = JSON.parse(req.body.user);
          console.log(`Datos enviados del usuario: ${JSON.stringify(user)}`);
      
          const files = req.files;
      
          if (files.length > 0) {
            const pathImage = `image_${Date.now()}`; // Nombre del archivo
            const url = await storage(files[0], pathImage);
      
            if (url) {
              user.image = url;
            }
          }
      
          await User.update(user);
      
          return res.status(201).json({
            success: true,
            message: 'Los datos del usuario se actualizaron correctamente',
          });
        } catch (error) {
          console.log(`Error: ${error}`);
          return res.status(501).json({
            success: false,
            message: 'Hubo un error al actualizar perfil!',
            error: error.message,
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
                        //expiresIn: (60 * 60 * 24) // una hora
                       // expiresIn: (60 * 3) // 2 min
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

                    await User.updateToken(myuser.id,`JWT ${token}`);
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
    },

    async logout(req, res, next) {
          try{
            
            const id = req.body.id;
           console.log(`IDDDD ${req.body.id}`);
            await User.updateToken(id, null);

            return res.status(201).json({
              success: true,
              message: 'La sesión del usuario se ha cerrado correctamente!',
            });

          }catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
              success: false,
              message: 'Hubo un error al momento de cerrar sesión!',
              error: error.message,
            });
          }
    }
};