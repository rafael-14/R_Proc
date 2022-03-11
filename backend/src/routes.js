const express = require('express');
const ProductController = require('./controllers/ProductController');
const routes = express.Router();

routes.get('/select_product', ProductController.index);


module.exports = routes;