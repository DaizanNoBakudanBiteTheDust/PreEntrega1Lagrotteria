import { Router } from 'express';
import ProductManager from '../managers/productManager.js';
const manager = new ProductManager('./src/files/productos.json');


const router = Router();

// traer todos los productos

router.get('/', async (req, res) =>{
    const products = await manager.getProducts();
    console.log(products)
    res.send(products)
    });

    // params


router.get('/', async (req, res) => {
    const products = await manager.getProducts();
    const queryParamsLimited = (req.query.limit);

    if (!queryParamsLimited) {
            res.send({error: 'Error pagina no encontrada'})
    } else {
            const productsLimited = products.slice(0, queryParamsLimited)
            res.send(productsLimited)
    };
});

// postea los productos

router.post('/', async (req, res) => {
    const products = await manager.getProducts();
    // Productos que haremos con Postman
    const product = req.body;

    if (!product.titulo || !product.descripcion || !product.precio || !product.thumbnail || !product.thumbnail || !product.code || !product.stock) {
            //Error del cliente
            return res.status(400).send({
                    status: 'error',
                    error: 'incomplete values'
            })
    }

    if (products.length === 0) {
            product.id = 1;
    } else {
            product.id = products[products.length - 1].id + 1;
    }

    await manager.addProducts(product);

    // status success
    return res.send({
            status: 'success',
            message: 'product created',
            product
    })
});

// Actualiza los productos

router.put('/:pid', async (req, res) => {

    const products = await manager.getProducts();
    // Productos que haremos con Postman
    const product = req.body;
    const productId = Number(req.params.pid);

    if (!product.titulo || !product.descripcion || !product.precio || !product.thumbnail || !product.thumbnail || !product.code || !product.stock) {
            //Error del cliente
            return res.status(400).send({
                    status: 'error',
                    error: 'incomplete values'
            })
    }

    const index = products.findIndex(product => product.id === productId);

    if (index !== 1) {
            await manager.updateProduct(productId, product);
            res.send({
                    status: 'success',
                    message: 'product updated',
                    product
            });
    } else {
            //Error del cliente
            return res.status(404).send({
                    status: 'error',
                    error: 'product not found'
            })
    }

});

// Elimina los productos

router.delete('/:pid', async (req, res) => {
    const products = await manager.getProducts();
    
    const productId = Number(req.params.pid);
await manager.deleteProductById(productId);
    const index = products.findIndex(product => product.id === productId);

    if (index !== 1) {
            await manager.deleteProductById(productId); 
            res.send({
                    status: 'success',
                    message: 'product deleted',
                    product
            });
    } else {
            //Error del cliente
            return res.status(404).send({
                    status: 'error',
                    error: 'product not exist'
            })
    }
})

export default router;
