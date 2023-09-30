import { Router, Router } from "express";

const router = Router();

//Middleware a nivel de router
router.use((req, res, next) => {
    console.log('Time Router: ', Date.now());
    next();
});

//Obtener el listado de mascotas
router.get('/', (req, res) => {
    res.send({ status: 'success', payload: pets });
});