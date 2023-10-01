import express from 'express';
import productRouter from './routes/products.router.js';


// Crea server express
const app = express();

//middleware
app.use(express.json({}));
app.use(express.urlencoded({
        extended: true
}));


app.use(express.static('public'))


app.use('/api/products', productRouter);

/*
app.use('/api/cart', cartRouter);
*/


app.listen(8080, () => console.log("listening en 8080"));

