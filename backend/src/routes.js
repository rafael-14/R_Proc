const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProductController = require('./controllers/ProcessesByProductController');
const UserController = require('./controllers/UserController');
const routes = express.Router();

routes.get('/api/select/products', ProductController.selectAllProducts);
routes.post('/api/insert/product', ProductController.insertProduct);
routes.post('/api/inactivate/product/:id', ProductController.inactivateProduct);
routes.post('/api/activate/product/:id', ProductController.activateProduct);

routes.get('/api/select/processes', ProcessController.selectAllProcesses);
routes.post('/api/insert/process', ProcessController.insertProcess);
routes.post('/api/inactivate/process/:id', ProcessController.inactivateProcess);
routes.post('/api/activate/process/:id', ProcessController.activateProcess);

//routes.get('/api/select_processes_by_product', ProcessesByProductController.selectAllProcessesByProduct);
routes.put('/api/select/processes_by_product/:id', ProcessesByProductController.selectProcessesByProduct);
routes.post('/api/insert_processes_by_product', ProcessesByProductController.insertProcessesByProduct);

routes.get('/api/select/users', UserController.selectAllUsers);
routes.post('/api/insert/user', UserController.insertUser);
routes.post('/api/inactivate/user/:id', UserController.inactivateUser);
routes.post('/api/activate/user/:id', UserController.activateUser);


module.exports = routes;