const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProduct = require('./controllers/ProcessesByProduct')
const routes = express.Router();

routes.get('/select_products', ProductController.selectAllProducts);
routes.post('/insert_product', ProductController.insertProduct);

routes.get('/select_processes', ProcessController.selectAllProcesses);
routes.post('/insert_process', ProcessController.insertProcess);

routes.get('/select_processes_by_product', ProcessesByProduct.selectAllProcessesByProduct);
routes.post('/insert_processes_by_product', ProcessesByProduct.insertProcessesByProduct);


module.exports = routes;