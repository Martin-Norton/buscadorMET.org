//define las rutas para la búsqueda de objetos
const express = require('express');
const router = express.Router();
const { search } = require('../controllers/busquedaController');

router.get('/search', search);

module.exports = router;
