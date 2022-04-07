const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProductController = require('./controllers/ProcessesByProductController');
const UserController = require('./controllers/UserController');
const ProcessesByUserController = require('./controllers/ProcessesByUserController')
const routes = express.Router();

routes.get('/api/select/products', ProductController.selectAllProducts);
routes.post('/api/insert/product', ProductController.insertProduct);
routes.put('/api/inactivate/product/:id', ProductController.inactivateProduct);
routes.put('/api/activate/product/:id', ProductController.activateProduct);

routes.get('/api/select/processes', ProcessController.selectAllProcesses);
routes.post('/api/insert/process', ProcessController.insertProcess);
routes.put('/api/inactivate/process/:id', ProcessController.inactivateProcess);
routes.put('/api/activate/process/:id', ProcessController.activateProcess);

routes.put('/api/select/processes_by_product/:id', ProcessesByProductController.selectProcessesByProduct);
routes.post('/api/insert/processes_by_product', ProcessesByProductController.insertProcessesByProduct);

routes.get('/api/select/users', UserController.selectAllUsers);
routes.post('/api/insert/user', UserController.insertUser);
routes.put('/api/inactivate/user/:id', UserController.inactivateUser);
routes.put('/api/activate/user/:id', UserController.activateUser);

//routes.put('/api/select/processes_by_product/:id', ProcessesByUserController.selectProcessesByProduct);
routes.post('/api/insert/processes_by_user', ProcessesByUserController.insertProcessesByUser);


module.exports = routes;