const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    await connectionPG.query(`select * from produto order by 1`)
      .then(results => {
        allProducts = results.rows
      })
    return res.json(allProducts)
  },

  async insertProduct(req, res) {
    let { name } = req.body;
    let insertProduct, datetime = new Date
    await connectionPG.query(`insert into produto(nome,data_criacao) values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProduct = results.rows })
    return res.json(insertProduct).status(200)
  }
};