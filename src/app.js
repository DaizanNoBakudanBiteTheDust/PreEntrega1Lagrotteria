import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';

// Crea server express
const app = express();

//middleware
app.use(express.json({}));
app.use(express.urlencoded({
        extended: true
}));


app.use(express.static('public'))

// Llama a la ruta de product Router (Todo lo hecho hasta ahora)
app.use('/api/products', productRouter);

// Ruta carts
app.use('/api/carts', cartRouter);



app.listen(8080, () => console.log("listening en 8080"));

