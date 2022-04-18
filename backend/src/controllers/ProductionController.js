const connectionPG = require('../database');
const nextProcess = require('../functions/nextProcess')

module.exports = {

  async selectProductionNotStarted(req, res) {
    await connectionPG.query(`select prodc.*, prod.nome as nome_produto, proc.nome as nome_processo, prod_ped.observacao, proc_prod.sequencia
    from producao prodc
    join produto prod on prod.id = prodc.id_produto
    join processo proc on proc.id = prodc.id_processo
    join produtos_por_pedido prod_ped on prod_ped.id_pedido = prodc.id_pedido
	  join processos_por_produto proc_prod on proc_prod.id_produto = prodc.id_produto
    where prodc.situacao = 0
	  and proc_prod.sequencia = 1`)
      .then(results => { productionNotStarted = results.rows })
      for (let i = 0; i < productionNotStarted.length; i++) {
        let x = await nextProcess.nextProcess(productionNotStarted[i].id_produto, productionNotStarted[i].sequencia)
        if (x[0] === undefined) {
          productionNotStarted[i].nome_proximo_processo = null
        } else {
          productionNotStarted[i].nome_proximo_processo = x[0].nome_proximo_processo
        }
      }
      //console.log(productionNotStarted)
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

async function teste1(req, res) {
  console.log("2")
}