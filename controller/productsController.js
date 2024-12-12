const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
const { production } = require('../config/env');

module.exports = {

    async create(req, res, next){
        const product = JSON.parse(req.body.product);
        console.log(`Producto ${JSON.stringify(product)}`);

        const files = req.files;

        let inserts = 0;
        if(files.leght === 0){
            return res.status(501).json({
                message: 'Error al registrar producto no tiene imagen',
                success: false
            });
        }
        else{
            try{

                const data = await Product.create(product); // ALMACENANDO LA INFORMACIÓN DEL PRODUCTO
                product.id = data.id;

                const start = async () => {
                    await asyncForEach(files, async (files) =>{
                        const pathImage = `image_${Date.now()}`;
                        const url = await storage(files, pathImage);

                        if(url !== undefined && url !== null){
                            if(inserts == 0){ // significa guarda la imagen 1
                                product.image1 = url;
                            }
                            else if(inserts == 1){ // image number 2
                                product.image2 = url;
                            }
                            else if(inserts == 2){ // image number 3
                                product.image3 = url;
                            }
                        }
                        await Product.update(product);
                        inserts = inserts + 1;

                        if(inserts == files.leght){
                            return res.status(201).json({
                                success: true,
                                message: 'El producto se ha registrado correctamente'
                            });
                        }
                    });
                }

                start();
                return res.status(201).json({
                    success: true,
                    message: 'Producto registrado con éxito',
                  });

            }catch(err){
                console.log(`Error: ${err}`)
                return res.status(501).json({
                    message: `Error al registrar producto: ${err}`,
                    success: false,
                    error: err

                });
            }
        }
    },

    async findByCategory(req, res, next){

        try{
            const id_category = req.params.id_category; // client req

            const data = await Product.findByCategory(id_category);

            return res.status(201).json(data);


        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                message: `Error al listar los productos por categoria: ${err}`,
                success: false,
                error: err

            });
        }

    },

    async findByCategoryAndProductName(req, res, next){

        try{
            const id_category = req.params.id_category;
            const product_name = req.params.product_name;  // client req

            const data = await Product.findByCategoryAndName(id_category, product_name);

            return res.status(201).json(data);


        }catch(err){
            console.log(`Error: ${err}`)
            return res.status(501).json({
                message: `Error al listar los productos por categoria y nombre: ${err}`,
                success: false,
                error: err

            });
        }

    }
}
