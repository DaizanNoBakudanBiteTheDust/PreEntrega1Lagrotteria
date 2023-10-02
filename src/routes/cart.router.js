import {
        Router
} from 'express';
import cartManager from '../managers/cartManager.js';
const manager = new cartManager('./src/files/carrito.json');


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

        if (!cart.products) {
                // Error del cliente
                return res.status(400).send({
                  status: 'error',
                  error: 'incomplete values'
                });
              }

         // Obtener un array con todos los "id" existentes 
        const existingIds = carts.map(p => p.id);     

        // Encontrar el primer "id" que falta
        let newId = 1;
        while (existingIds.includes(newId)) {
                newId++;
        }

        // Asignar el "id" encontrado al producto
        cart.id = newId;


        await manager.addProducts(cart);

        // status success
        return res.send({
                status: 'success',
                message: 'product created',
                cart
        })
});


router.post('/:cid/products/pid', async (req, res) => {

        const cart = Number(req.params.cid);
        const product = Number(req.params.pid);

        // actualiza

       const updateProduct = await manager.updateProduct(cart, product);
        
       if(updateProduct){
        res.send({
                status: 'success',
                message: 'product updated',
                product
        });
       }else {
        //Error del cliente
        return res.status(404).send({
                status: 'error',
                error: 'product not found'
        })
}
       
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