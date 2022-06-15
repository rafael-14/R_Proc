const connectionPG = require('../database');
const lastProcess = require('../functions/lastProcess');

module.exports = {
  async selectAllOrders(req, res) {
    await connectionPG.query(`SELECT * FROM pedido ORDER BY 1`)
      .then(results => { allOrders = results.rows })
    for (let i = 0; i < allOrders.length; i++) {
      await connectionPG.query(`SELECT id, id_produto FROM produtos_por_pedido WHERE id_pedido = ${allOrders[i].id}`)
        .then(results => { idStatus = results.rows })
      let dataLastProcess = await lastProcess.lastProcess(idStatus)
      for (let j = 0; j < dataLastProcess.length; j++) {
        await connectionPG.query(`SELECT * FROM producao
          WHERE id_processo = ${dataLastProcess[j].id_processo}
          AND id_produto = ${idStatus[j].id_produto}
          AND id_produto_pedido = ${idStatus[j].id}`)
          .then(results => { productionStatus = results.rows })
        if (!productionStatus[0]) {
          allOrders[i].status = "Em andamento"
        } else {
          allOrders[i].status = "Concluído"
        }
      }
    }
    return res.json(allOrders)
  },

  async insertOrder(req, res) {
    let datetime = new Date
    await connectionPG.query(`INSERT INTO pedido
      (data_pedido)
      VALUES('${datetime.toISOString().slice(0, 10)}')
      RETURNING id`).then(results => { insertOrder = results.rows })
    return res.json(insertOrder[0]).status(200)
  }
};