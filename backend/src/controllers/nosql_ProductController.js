const Product = require('../models/Product')

module.exports = {
  async selectAllProducts(req, res) {
    return res.json(await Product.find())
  },

  async insertProduct(req, res) {
    let { name } = req.body;
    let datetime = new Date
    let status = 500
    let insertProduct = await Product.findOne({nome:name})
    if (!insertProduct) {
      status = 200
      insertProduct = await Product.create({nome:name, ativo: true, data_criacao:datetime.toISOString().slice(0, 10)})
    }
    return res.json(insertProduct).status(status)
  }
};