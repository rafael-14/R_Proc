const dbConfig = require('../config/database');
const product = require('../models/Product');

const {Pool} = require('pg')
const pgConfig = require('../config/PG_Connection')
const PG_Connection = new Pool(pgConfig);

product.init(connection);


module.exports = (connection, PG_Connection);