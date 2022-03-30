const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    await connectionPG.query(`select prod.id ,prod.nome, proc.nome


    from produto prod
    
    left join processos_por_produto ppp on prod.id = ppp.id_produto
    left join processo proc on ppp.id_processo = proc.id
    
    where prod.id = 1`)
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