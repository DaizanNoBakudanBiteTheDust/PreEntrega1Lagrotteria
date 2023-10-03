import {
        Router
} from 'express';
import cartManager from '../managers/cartManager.js';
import {
        cartsFilePath
} from '../utils.js';

const manager = new cartManager(cartsFilePath);


const router = Router();


// traer todos los productos

router.get('/', async (req, res) => {
        const carts = await manager.getAll();
        res.send(carts)
});

// Agrega params


router.get('/', async (req, res) => {
        const carts = await manager.getAll();
        const queryParamsLimited = (req.query.limit);

        if (!queryParamsLimited) {
                res.send({
                        error: 'Error pagina no encontrada'
                })
        } else {
                const productsLimited = carts.slice(0, queryParamsLimited)
                res.send(productsLimited)
        };
});


// postea los productos

router.post('/', async (req, res) => {
        const carts = await manager.getAll();
        // Productos que haremos con Postman
        const cart = req.body;

        // Obtener un array con todos los "id" existentes 
        const existingIds = carts.map(p => p.id);

        // Encontrar el primer "id" que falta
        let newId = 1;
        while (existingIds.includes(newId)) {
                newId++;
        }

        // Asignar el "id" encontrado al producto
        cart.id = newId;

        if (!cart.products) {
                // Error del cliente
                return res.status(400).send({
                        status: 'error',
                        error: 'incomplete values'
                });
        }


        await manager.addProducts(cart);

        // status success
        return res.send({
                status: 'success',
                message: 'product created',
                cart
        })
});


router.post('/:cid/products/pid', async (req, res) => {

        const carts = await manager.getAll();

        // utilizo params de carrito y producto
        const cartId = Number(req.params.cid);
        const productId = Number(req.params.pid)

        //carrito por ID

        const cart = await manager.getProductById(cartId);

        if (!cart) {
                return res.status(404).json({
                        error: 'Carrito no encontrado'
                });
        }

        // verifica si el carro esta vacio

        if (!cart.products || cart.products.length === 0) {
                console.log("carro vacio");
        }

        const existingProduct = cart.products.find(product => product.id === productId);

        if (existingProduct) {
                // Si el producto ya existe, incrementa la cantidad
                existingProduct.quantity += 1;
        } else {
                // Si el producto no existe, agrégalo al arreglo "products"
                const addedProduct = {
                        product: productId,
                        quantity: 1
                      };
                      cart.products.push(addedProduct);
        }

         // Actualiza el carrito con los cambios
         await manager.updateProduct(cartId, cart);

        await manager.addProducts(cart);

        // status success
        return res.send({
                status: 'success',
                message: 'product added',
                cart
        })

});


export default router;