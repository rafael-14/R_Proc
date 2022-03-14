const express = require('express');
const ProductController = require('./controllers/ProductController');
const routes = express.Router();

routes.get('/select_product', ProductController.selectAll);
routes.post('/insert_product', ProductController.insertProduct);


module.exports = routes;