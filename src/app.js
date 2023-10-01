import express from 'express';
import ProductManager from './managers/productManager.js';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

// Crea server express
const app = express();

const manager = new ProductManager('./src/files/productos.json');


//middleware
app.use(express.json({}));
app.use(express.urlencoded({
        extended: true
}));


app.use(express.static('public'))


app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);

// traer todos los productos

app.get('/products', async (req, res) => {
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

app.post('/products', async (req, res) => {
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

app.listen(8080, () => console.log("listening en 8080"));

