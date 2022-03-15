const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProduct = require('./controllers/ProcessesByProduct')
const routes = express.Router();

routes.get('/api/select_products', ProductController.selectAllProducts);
routes.post('/api/insert_product', ProductController.insertProduct);

routes.get('/api/select_processes', ProcessController.selectAllProcesses);
routes.post('/api/insert_process', ProcessController.insertProcess);

routes.get('/api/select_processes_by_product', ProcessesByProduct.selectAllProcessesByProduct);
routes.post('/api/insert_processes_by_product', ProcessesByProduct.insertProcessesByProduct);


module.exports = routes;