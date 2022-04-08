const connectionPG = require('../database');

module.exports = {
  async selectAllOrders(req, res) {
    await connectionPG.query(`SELECT * FROM pedido order by 1`)
      .then(results => { allOrders = results.rows })
    return res.json(allOrders)
  },

  async insertOrder(req, res) {
    let datetime = new Date
    await connectionPG.query(`insert into pedido
      (data_pedido)
      values('${datetime.toISOString().slice(0, 10)}')
      returning id`).then(results => { insertOrder = results.rows })
    return res.json(insertOrder[0]).status(200)
  }
};