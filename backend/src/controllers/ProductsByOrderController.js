const connectionPG = require('../database');

module.exports = {
  async insertProductsByOrder(req, res) {
    let { orderID, orderProducts } = req.body;
    let datetime = new Date
    for (let i = 0; i < orderProducts.length; i++) {
      await connectionPG.query(`insert into produtos_por_pedido
      (id_pedido, id_produto, sequencia, quantidade, data_pedido)
      values(${orderID}, ${orderProducts[i].id}, ${i + 1}, ${orderProducts[i].productQuantity} ,'${datetime.toISOString().slice(0, 10)}')`)
    }
    return res.json().status(200)
  }
};