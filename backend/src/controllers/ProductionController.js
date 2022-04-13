const connectionPG = require('../database');

module.exports = {
  async selectProductionNotStarted(req, res) {
    await connectionPG.query(`select prodc.*, prod.nome as nome_produto, proc.nome as nome_processo
    from producao prodc
    join produto prod on prod.id = prodc.id_produto
    join processo proc on proc.id = prodc.id_processo
    where prodc.situacao = 0`)
      .then(results => { productionNotStarted = results.rows })
    return res.json(productionNotStarted)
  },

  async insertProduction(req, res) {
    let { orderID, productID, userID } = req.body;
    for (let i = 0; i < productID.length; i++) {
      await connectionPG.query(`select * from processos_por_produto where id_produto = ${productID[i].id} order by sequencia limit 1`)
        .then(results => processID = results.rows)
      await connectionPG.query(`insert into producao
      (id_pedido, id_produto, id_processo, id_usuario, situacao)
      values(${orderID}, ${productID[i].id}, ${processID[0].id_processo}, 1 , 0)`)
    }
    return res.json().status(200)
  }
};