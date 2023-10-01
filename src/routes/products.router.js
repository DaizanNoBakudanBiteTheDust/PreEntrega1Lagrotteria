import { Router } from 'express';

const router = Router();
const products = [];

//Obtener el listado de mascotas
router.get('/', (req, res) => {
    res.send({ status: 'success', payload: pets });
});

//Middleware a nivel de router
router.use((req, res, next) => {
    console.log('Time Router: ', Date.now());
    next();
});

// traer todos los productos

app.get('/', async (req, res) => {
    const products = await manager.getProducts();
    const queryParamsLimited = (req.query.limit);

    if (!queryParamsLimited) {
            res.send({error: 'Error pagina no encontrada'})
    } else {
            const productsLimited = products.slice(0, queryParamsLimited)
            res.send(productsLimited)
    };
    res.send(products);
});

// postea los productos

app.post('/', async (req, res) => {
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

app.put('/products/:id', async (req, res) => {

    const products = await manager.getProducts();
    // Productos que haremos con Postman
    const product = req.body;
    const productId = Number(req.params.id);

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

app.delete('/products/:id', async (req, res) => {
    const productId = Number(req.params.id);
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
