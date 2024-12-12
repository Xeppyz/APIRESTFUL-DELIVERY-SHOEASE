const Order = require('../models/order');
const OrderHasProducts = require('../models/order_has_products');

module.exports = {




    async findByStatus(req, res, next){
        try{
    
            const status = req.params.status;
            
            console.log(`ESTADO: ${status}`);
    
            const data = await Order.findByStatus(status);
            //console.log(`STATUS ${JSON.stringify(data)}`);
            return res.status(201).json(data);
    
        }catch(err){
            console.log(`err: ${err}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: err,
                success: false
            });
        }
    },


    async findByDeliveryAndStatus(req, res, next){
        try{
    

            const id_delivery = req.params.id_delivery;
            const status = req.params.status;
            
            console.log(`ESTADO: ${status}`);
    
            const data = await Order.findByDeliveryAndStatus(id_delivery, status);
            console.log(`STATUS del delivery ${JSON.stringify(data)}`);
            return res.status(201).json(data);
    
        }catch(err){
            console.log(`err: ${err}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: err,
                success: false
            });
        }
    },


    
    async findByClientAndStatus(req, res, next){
        try{
    

            const id_client = req.params.id_client;
            const status = req.params.status;
            
            console.log(`ESTADO: ${status}`);
    
            const data = await Order.findByClientAndStatus(id_client, status);
            console.log(`STATUS del delivery ${JSON.stringify(data)}`);
            return res.status(201).json(data);
    
        }catch(err){
            console.log(`err: ${err}`);
            return res.status(501).json({
                message: 'Hubo un error al tratar de obtener las ordenes por estado',
                error: err,
                success: false
            });
        }
    },


    async create(req, res, next){
    try{

        let order = req.body;
        order.status = 'PAGADO';
        const data = await Order.create(order);

        console.log('LA ORDEN SE CREÓ CORRECTAMENTE');

        //Recorrer todos los productos agregados a la orden
        for(const product of order.products){
            await OrderHasProducts.create(data.id, product.id, product.quantity);

        }

        return res.status(201).json({
            success: true,
            message: 'La orden se creó correctamente',
            data: data.id
        });

    }catch(err){
        console.log(`Error: ${err}`)
        return res.status(501).json({
            success: false,
            message: 'Hubo un error creando la orden',
            error: err
        });
    }
    },

    
    async updateToDispatched(req, res, next){
        try{
    
            let order = req.body;
            order.status = 'EMPACADO';
            await Order.update(order);
    
          
        
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
       
            });
    
        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: err
            });
        }
    },

    async updateToDelivered(req, res, next){
        try{
    
            let order = req.body;
            order.status = 'ENTREGADO';
            await Order.update(order);
    
          
        
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
       
            });
    
        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: err
            });
        }
    },

    async updateLatLng(req, res, next){
        try{
    
            let order = req.body;
    
            await Order.updateLatLng(order);
    
          
        
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
       
            });
    
        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: err
            });
        }
    },


    async updateOnTheWay(req, res, next){
        try{
    
            let order = req.body;
            order.status = 'EN CAMINO';
            await Order.update(order);
    
          
        
            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
       
            });
    
        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar la orden',
                error: err
            });
        }
    },



}