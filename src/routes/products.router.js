import {
        Router
} from 'express';
import ProductManager from '../managers/productManager.js';
import { productsFilePath } from '../utils.js';
const manager = new ProductManager(productsFilePath);


const router = Router();

// traer todos los productos

router.get('/', async (req, res) => {
        const products = await manager.getProducts();
        console.log(products)
        
});

// params


router.get('/', async (req, res) => {
        const products = await manager.getProducts();
        const queryParamsLimited = (req.query.limit);

        if (!queryParamsLimited) {
                res.send({
                        error: 'Error pagina no encontrada'
                })
        } else {
                if(queryParamsLimited){
                        const productsLimited = products.slice(0, queryParamsLimited)
                res.send(productsLimited)
                }else{
                        res.send(products);
                }
        };
});

// postea los productos

router.post('/', async (req, res) => {
        const products = await manager.getProducts();
        // Productos que haremos con Postman
        const product = req.body;

        if (!product.titulo || !product.descripcion || !product.precio || !product.thumbnail || !product.thumbnail || !product.code || !product.stock || !product.category) {
                //Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                })
        }

        // Obtener un array con todos los "id" existentes ( hice esto porque al eliminar productos seguia sumando indefinido y necesitaba rellenar id)
        const existingIds = products.map(p => p.id);

        // Encontrar el primer "id" que falta
        let newId = 1;
        while (existingIds.includes(newId)) {
                newId++;
        }

        // Verificar la existencia del "code" en productos existentes
        const existingCodes = products.map(p => p.code);
        if (existingCodes.includes(product.code)) {
            return res.status(409).send({
                status: 'error',
                error: 'El producto con este código ya existe.'
            });
        }

        // Asignar el "id" encontrado al producto
        product.id = newId;


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

        if (!product.titulo || !product.descripcion || !product.precio || !product.thumbnail || !product.thumbnail || !product.code || !product.stock || !product.status || !product.category) {
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