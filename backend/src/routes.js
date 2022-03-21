const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProductController = require('./controllers/ProcessesByProductController')
const routes = express.Router();

routes.get('/api/select/products', ProductController.selectAllProducts);
routes.get('/api/select/product/:id', ProductController.findProduct);
routes.post('/api/insert/product', ProductController.insertProduct);
routes.put('/api/update/product/:id', ProductController.updateProduct);
routes.put('/api/activate/product/:id', ProductController.activateProduct);
routes.put('/api/inactivate/product/:id', ProductController.inactivateProduct);

routes.get('/api/select/processes', ProcessController.selectAllProcesses);
routes.get('/api/select/process/:id', ProcessController.findProcess);
routes.post('/api/insert/process', ProcessController.insertProcess);
routes.put('/api/update/process/:id', ProcessController.updateProcess);
routes.put('/api/activate/process/:id', ProcessController.activateProcess);
routes.put('/api/inactivate/process/:id', ProcessController.inactivateProcess);

//routes.get('/api/select_processes_by_product', ProcessesByProductController.selectAllProcessesByProduct);
//routes.put('/api/select_processes_by_product/:id', ProcessesByProductController.selectProcessesByProduct);
//routes.post('/api/insert_processes_by_product', ProcessesByProductController.insertProcessesByProduct);


module.exports = routes;