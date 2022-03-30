const connectionPG = require('../database');

module.exports = {
  async selectAllProcessesByProduct(req, res) {
    let allProcessesByProduct
    await connectionPG.query(`select * from processos_por_produto
    `)
      .then(results => {
        allProcessesByProduct = results.rows
      })
    return res.json(allProcessesByProduct)
  },

  async selectProcessesByProduct(req, res) {
    let { id } = req.params;
    let processesByProduct
    await connectionPG.query(`SELECT * FROM processos_por_produto where id_produto = ${id}`)
      .then(results => {
        processesByProduct = results.rows
      })
    return res.json(processesByProduct)
  },

  async insertProcessesByProduct(req, res) {
    let { productID, processID } = req.body;
    let insertProcessesByProduct, datetime = new Date
    processID.sort((a, b) => {return a.order - b.order}); //ordena os processos pela sua ordem
    for (let i = 0; i < processID.length; i++) {
      await connectionPG.query(`insert into 
        processos_por_produto(id_produto, id_processo, sequencia, data_criacao)
        values(${productID}, ${processID[i].id}, ${i+1}, '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcessesByProduct = results.rows })
    }
    return res.json(insertProcessesByProduct).status(200)
  }
};