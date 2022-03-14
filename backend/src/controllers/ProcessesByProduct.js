const connectionPG = require('../database');

module.exports = {
  async selectAllProcessesByProduct(req, res) {
    await connectionPG.query(`SELECT * FROM processos_por_produto`)
      .then(results => {
        allProcessesByProduct = results.rows
      })
    return res.json(allProcessesByProduct)
  },

  async insertProcessesByProduct(req, res) {
    let { productID, process1ID, process2ID, process3ID, process4ID, process5ID, process6ID, process7ID, process8ID, process9ID, process10ID } = req.body;
    let insertProcessesByProduct, datetime = new Date
    await connectionPG.query(`insert into processos_por_produto
      (id_produto, id_processo1, id_processo2, id_processo3, id_processo4, id_processo5, id_processo6, id_processo7, id_processo8, id_processo9, id_processo10, data_criacao)
      values(${productID}, ${process1ID}, ${process2ID}, ${process3ID}, ${process4ID}, ${process5ID}, ${process6ID}, ${process7ID}, ${process8ID}, ${process9ID}, ${process10ID},  
      '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcessesByProduct = results.rows })
    return res.json(insertProcessesByProduct).status(200)
  }
};