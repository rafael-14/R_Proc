const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    await connectionPG.query(`select * from produto order by 1`)
      .then(results => { allProducts = results.rows })
    return res.json(allProducts)
  },

  async insertProduct(req, res) {
    let { productName } = req.body;
    let datetime = new Date
    await connectionPG.query(`insert into produto(nome,data_criacao) values('${productName}', '${datetime.toISOString().slice(0, 10)}')`)
    await connectionPG.query(`select * from produto where nome = '${productName}'`)
      .then(results => { insertProduct = results.rows })
    return res.json(insertProduct[0]).status(200)
  },

  async inactivateProduct(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update produto set ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' where id = ${id}`)
    return res.json().status(200)
  },

  async activateProduct(req, res) {
    let { id } = req.params;
    await connectionPG.query(`update produto set ativo=true, data_inativacao=null where id = ${id}`)
    return res.json().status(200)
  }
};