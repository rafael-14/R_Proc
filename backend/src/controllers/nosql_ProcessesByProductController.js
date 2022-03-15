const ProcessesByProduct = require('../models/ProcessesByProduct');

module.exports = {
  async selectAllProcessesByProduct(req, res) {
    return res.json(await ProcessesByProduct.find())
  },

  async insertProcessesByProduct(req, res) {
    let {data, qwe} = req.body;
    let datetime = new Date
    let status = 500
    console.log(data)
    console.log(qwe)
    let insertProcessesByProduct = await ProcessesByProduct.findOne({id_produto:productID})
    if (!insertProcessesByProduct) {
      status = 200
      data['ativo'] = true
      data[data_criacao] = datetime.toISOString().slice(0, 10)
      insertProcessesByProduct = await ProcessesByProduct.create(data)
    }
    return res.json(insertProcessesByProduct).status(status)
  }
};