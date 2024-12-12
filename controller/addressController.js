const Address = require('../models/address');

module.exports = {

async create(req, res, next){
    try{

        const address = req.body;
        const data = await Address.create(address);

        return res.status(201).json({
            success: true,
            message: 'Dirección registrada correctamente',
            data: data.id
        });


    }catch(err){
        console.log(`Error: ${err}`)
        return res.status(501).json({
            success: false,
            message: 'Hubo un error creando la dirección',
            error: err
        });
    }
},


async fyndByUser(req, res, next){
    try{

        const id_user = req.params.id_user;

        const data = await Address.findByUser(id_user);
        console.log(`Address ${JSON.stringify(data)}`);
        return res.status(201).json(data);

    }catch(err){
        console.log(`err: ${err}`);
        return res.status(501).json({
            message: 'Hubo un error al tratar de obtener las direcciones',
            error: err,
            success: false
        });
    }
}

}