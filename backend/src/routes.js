const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProductController = require('./controllers/ProcessesByProductController')
const routes = express.Router();

routes.get('/api/select/products', ProductController.selectAllProducts);
routes.post('/api/insert/product', ProductController.insertProduct);

routes.get('/api/select/processes', ProcessController.selectAllProcesses);
routes.post('/api/insert/process', ProcessController.insertProcess);

//routes.get('/api/select_processes_by_product', ProcessesByProductController.selectAllProcessesByProduct);
//routes.put('/api/select_processes_by_product/:id', ProcessesByProductController.selectProcessesByProduct);
//routes.post('/api/insert_processes_by_product', ProcessesByProductController.insertProcessesByProduct);


module.exports = routes;