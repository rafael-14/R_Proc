const express = require('express');
const ProductController = require('./controllers/ProductController');
const routes = express.Router();

routes.post('/select_product', ProductController.index);


module.exports = routes;