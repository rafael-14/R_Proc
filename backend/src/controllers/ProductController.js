const connectionPG = require('../database/');

module.exports = {
  async selectAll(req, res) {
    await connectionPG.query(`SELECT * FROM produto`)
      .then(results => {
        listaEmpresa = results.rows
      })
    return res.json(listaEmpresa)
  },

  async insertProduct(req, res) {
    let { name } = req.body;
    let insertProduct, datetime = new Date
    await connectionPG.query(`insert into produto(nome,ativo,data_criacao) values('${name}',true, '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProduct = results.rows })
    console.log("4")
    return res.json(insertProduct).status(200)
  }
};