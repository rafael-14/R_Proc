const express = require('express');
const ProductController = require('./controllers/ProductController');
const ProcessController = require('./controllers/ProcessController');
const ProcessesByProductController = require('./controllers/ProcessesByProductController');
const UserController = require('./controllers/UserController');
const ProcessesByUserController = require('./controllers/ProcessesByUserController');
const OrderController = require('./controllers/OrderController');
const ProductsByOrderController = require('./controllers/ProductsByOrderController');
const SectorController = require('./controllers/SectorController');
const UsersBySectorController = require('./controllers/UsersBySectorController');
const ProductionController = require('./controllers/ProductionController');
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
routes.post('/api/select/user_by_code', UserController.userByCode);

routes.put('/api/select/processes_by_user/:id', ProcessesByUserController.selectProcessesByUser);
routes.post('/api/insert/processes_by_user', ProcessesByUserController.insertProcessesByUser);
routes.post('/api/verify/process_by_user', ProcessesByUserController.verifyProcessByUser);
routes.post('/api/verify/processes_by_user', ProcessesByUserController.verifyProcessesByUser);

routes.get('/api/select/orders', OrderController.selectAllOrders);
routes.post('/api/insert/order', OrderController.insertOrder);

routes.put('/api/select/products_by_order/:id', ProductsByOrderController.selectProductsByOrder);
routes.post('/api/insert/products_by_order', ProductsByOrderController.insertProductsByOrder);

routes.get('/api/select/sectors', SectorController.selectAllSectors);
routes.post('/api/insert/sector', SectorController.insertSector);

routes.post('/api/login', SectorController.login);
routes.get('/api/check/token', SectorController.checkToken);
routes.get('/api/destroy/token', SectorController.destroyToken);

routes.put('/api/select/users_by_sector/:id', UsersBySectorController.selectUsersBySector);
routes.post('/api/insert/users_by_sector', UsersBySectorController.insertUsersBySector);

routes.post('/api/insert/production', ProductionController.insertProduction);
routes.put('/api/start/production/:id', ProductionController.startProduction);
routes.put('/api/pause/production/:id', ProductionController.pauseProduction);
routes.put('/api/resume/production/:id', ProductionController.resumeProduction);
routes.put('/api/finish/production/:id', ProductionController.finishProduction);
routes.post('/api/select/production_not_started', ProductionController.selectProductionNotStarted);
routes.post('/api/select/production_started', ProductionController.selectProductionStarted);
routes.post('/api/select/production_paused', ProductionController.selectProductionPaused);
routes.put('/api/start/many_productions', ProductionController.startManyProductions);
routes.put('/api/pause/many_productions', ProductionController.pauseManyProductions);
routes.put('/api/resume/many_productions', ProductionController.resumeManyProductions);
routes.put('/api/finish/many_productions', ProductionController.finishManyProductions);
routes.post('/api/verify/user', ProductionController.verifyUser);
routes.post('/api/verify/users', ProductionController.verifyUsers);
routes.post('/api/qrcode', ProductionController.qrCode);

module.exports = routes;