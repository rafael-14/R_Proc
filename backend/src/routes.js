const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const routes = express.Router();

routes.get('/select_products', ProductController.selectAllProducts);
routes.post('/insert_product', ProductController.insertProduct);

routes.get('/select_processes', ProcessController.selectAllProcesses);
routes.post('/insert_process', ProcessController.insertProcess);


module.exports = routes;