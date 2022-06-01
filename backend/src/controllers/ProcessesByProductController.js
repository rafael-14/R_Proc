const connectionPG = require('../database');

module.exports = {
  async selectProcessesByProduct(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT * FROM processos_por_produto proc_prod
    join processo proc on proc.id = proc_prod.id_processo
    where proc_prod.id_produto = ${id}`)
      .then(results => { processesByProduct = results.rows })
    return res.json(processesByProduct)
  },

  async insertProcessesByProduct(req, res) {
    let { productID, processesID } = req.body;
    let datetime = new Date
    processesID.sort((a, b) => { return a.order - b.order }); //ordena os processos pela sua ordem
    for (let i = 0; i < processesID.length; i++) {
      await connectionPG.query(`insert into 
        processos_por_produto(id_produto, id_processo, sequencia, data_criacao)
        values(${productID}, ${processesID[i].id}, ${i + 1}, '${datetime.toISOString().slice(0, 10)}')`)
    }
    return res.json().status(200)
  },

  async nextProcess(req, res) {
    let { productID, processByProduct_Sequence } = req.body;
    await connectionPG.query(`select * from processos_por_produto
        where id_produto = ${productID}
        and sequencia = ${processByProduct_Sequence + 1}`)
      .then(results => { nextProcess = results.rows })
    return res.json(nextProcess)
  }
};