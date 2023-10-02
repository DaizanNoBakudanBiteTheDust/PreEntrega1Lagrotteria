import {
        Router
} from 'express';
import cartManager from '../managers/cartManager.js';
const manager = new cartManager('./src/files/carrito.json');


const router = Router();

// postea los productos

router.post('/', async (req, res) => {
        const cart = await manager.getAll();
        // Productos que haremos con Postman
        const product = req.body;

        const savedProduct = {};

        if (!product.titulo || !product.descripcion || !product.precio || !product.thumbnail || !product.code || !product.stock || !product.category) {
                //Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                })
        }

        // Obtener un array con todos los "id" existentes
        const existingIds = cart.map(item => item.id);

        // Encontrar el primer "id" que falta
        let newId = 1;
        while (existingIds.includes(newId)) {
                newId++;
        }

        // Asignar el "id" encontrado al producto
        product.id = newId;


        await manager.addProducts(product);

        // status success
        return res.send({
                status: 'success',
                message: 'cart product created',
                product
        })
});

// Actualiza los productos

router.put('/:cid', async (req, res) => {

        const products = await manager.getProducts();
        // Productos que haremos con Postman
        const product = req.body;
        const cartId = Number(req.params.cid);

        if (!product.quantity || !product.descripcion || !product.precio || !product.thumbnail || !product.thumbnail || !product.code || !product.stock) {
                //Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                })
        }

        const index = products.findIndex(product => product.id === cartId);

        if (index !== -1) {
                await manager.updateProduct(cartId, product);
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


router.post('/:cid/products/pid', async (req, res) => {

        const cart = await manager.getAll();
        const { cid, pid } = req.params;
        // Toma el arreglo y le hago un push

        const cartById = cart.find(cart => cart.id === cid);


        if (!cartById) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
        // verifica si existe

        const indexProductInCart = cartById.products.findIndex(product => product.id === parseInt(pid));
        if (indexProductInCart !== -1) {
                cartById.products[indexProductInCart].quantity++;
        } else {
                cartById.products.push({
                        id: parseInt(pid),
                        quantity:1,
                });
        }
        //Guardar en el archivo
        await cartManager.save(cart);
});


export default router;