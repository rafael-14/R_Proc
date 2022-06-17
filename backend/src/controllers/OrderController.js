const connectionPG = require('../database');
const lastProcess = require('../functions/lastProcess');

module.exports = {
  async selectAllOrders(req, res) {
    await connectionPG.query(`SELECT * FROM pedido ORDER BY 1`)
      .then(results => { allOrders = results.rows })
    //Retorna todos os pedidos
    for (let i = 0; i < allOrders.length; i++) {
      await connectionPG.query(`SELECT id, id_produto, quantidade FROM produtos_por_pedido WHERE id_pedido = ${allOrders[i].id}`)
        .then(results => { idStatus = results.rows })
      //Retorna o ID e o ID dos produtos de cada pedido na tabela produtos_por_pedido
      let dataLastProcess = await lastProcess.lastProcess(idStatus)
      //A função chamada acima, retornará o último Processo de cada Produto
      for (let j = 0; j < dataLastProcess.length; j++) {
        await connectionPG.query(`SELECT * FROM producao
          WHERE id_processo = ${dataLastProcess[j].id_processo}
          AND id_produto = ${idStatus[j].id_produto}
          AND id_produto_pedido = ${idStatus[j].id}
          AND situacao = 4
          ORDER BY id DESC`)
          .then(results => { productionStatus = results.rows, productionStatusQuantity = results.rowCount })
        if (!productionStatus[0] || (productionStatusQuantity != idStatus[j].quantidade)) {
          allOrders[i].status = "Em Andamento"
        }
      }
    }
    return res.json(allOrders)
  },

  async insertOrder(req, res) {
    let datetime = new Date
    await connectionPG.query(`INSERT INTO pedido
      (data_pedido)
      VALUES('${datetime.toISOString()}')
      RETURNING id`).then(results => { insertOrder = results.rows })
    return res.json(insertOrder[0]).status(200)
  }
};