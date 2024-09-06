//rutas de acceso al objeto especifico
const express = require('express');
const router = express.Router();
const { getObject } = require('../controllers/objetoController');

router.get('/object/:id', getObject);

module.exports = router;
