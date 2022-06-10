const connectionPG = require('../database');

module.exports = {
  async selectProductsByOrder(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT * FROM produtos_por_pedido prod_ped
    join produto prod on prod.id = prod_ped.id_produto
    where prod_ped.id_pedido = ${id}`)
      .then(results => { productsByOrder = results.rows })
    return res.json(productsByOrder)
  },

  async insertProductsByOrder(req, res) {
    let { orderID, orderProducts } = req.body;
    let datetime = new Date
    let insertProductsByOrder = [];
    for (let i = 0; i < orderProducts.length; i++) {
      await connectionPG.query(`insert into produtos_por_pedido
      (id_pedido, id_produto, sequencia, quantidade, data_pedido, observacao)
      values(${orderID}, ${orderProducts[i].id}, ${i + 1}, ${orderProducts[i].productQuantity},
      '${datetime.toISOString().slice(0, 10)}', ${orderProducts[i].productNote !== "" ? `'${orderProducts[i].productNote}'` : null})
      returning id as id_produto_pedido, id_produto`)
        .then(results => { insertProductsByOrder = [...insertProductsByOrder, ...results.rows] })
    }
    return res.json(insertProductsByOrder).status(200)
  }
};