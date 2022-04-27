const connectionPG = require('../database');
const nextProcess = require('../functions/nextProcess')

module.exports = {

  async selectProductionNotStarted(req, res) {
    await connectionPG.query(`select prodc.*, prod.nome as nome_produto, proc.nome as nome_processo, prod_ped.observacao
    from producao prodc
    join produto prod on prod.id = prodc.id_produto
    join processo proc on proc.id = prodc.id_processo
    --join processos_por_produto proc_prod on proc_prod.id_produto = prodc.id_produto
    join produtos_por_pedido prod_ped on prod_ped.id_pedido = prodc.id_pedido and prod_ped.id_produto = prodc.id_produto
    where prodc.situacao = 0`)
      .then(results => { productionNotStarted = results.rows })
    for (let i = 0; i < productionNotStarted.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionNotStarted[i].id_produto, productionNotStarted[i].id_processo)
      productionNotStarted[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionNotStarted[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    return res.json(productionNotStarted)
  },

  async selectProductionStarted(req, res) {
    await connectionPG.query(`select prodc.*, prod.nome as nome_produto, proc.nome as nome_processo,prod_ped.observacao
    from producao prodc
    join produto prod on prod.id = prodc.id_produto
    join processo proc on proc.id = prodc.id_processo
    join produtos_por_pedido prod_ped on prod_ped.id_pedido = prodc.id_pedido and prod_ped.id_produto = prodc.id_produto
    where prodc.situacao in (1, 3)`)
      .then(results => { productionStarted = results.rows })
    for (let i = 0; i < productionStarted.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionStarted[i].id_produto, productionStarted[i].id_processo)
      productionStarted[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionStarted[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    return res.json(productionStarted)
  },

  async selectProductionPaused(req, res) {
    await connectionPG.query(`select prodc.*, prod.nome as nome_produto, proc.nome as nome_processo, prod_ped.observacao
    from producao prodc
    join produto prod on prod.id = prodc.id_produto
    join processo proc on proc.id = prodc.id_processo
    join produtos_por_pedido prod_ped on prod_ped.id_pedido = prodc.id_pedido and prod_ped.id_produto = prodc.id_produto
    where prodc.situacao = 2`)
      .then(results => { productionPaused = results.rows })
    for (let i = 0; i < productionPaused.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionPaused[i].id_produto, productionPaused[i].id_processo)
      productionPaused[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionPaused[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    return res.json(productionPaused)
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
  },

  async startProduction(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao set situacao = 1 where id = ${id}`)
    await connectionPG.query(`insert into producao_tempo
    (id_producao, inicio)
    values(${id}, '${datetime.toISOString()}')`)
    return res.json().status(200)
  },

  async pauseProduction(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao set situacao = 2 where id = ${id}`)
    await connectionPG.query(`update producao_tempo set fim = '${datetime.toISOString()}' where id_producao = ${id}`)
    return res.json().status(200)
  },

  async resumeProduction(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao set situacao = 3 where id = ${id}`)
    await connectionPG.query(`insert into producao_tempo
    (id_producao, inicio)
    values(${id}, '${datetime.toISOString()}')`)
    return res.json().status(200)
  },

  async finishProduction(req, res) {
    let { id_proximo_processo } = req.body;
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao_tempo set fim = '${datetime.toISOString()}' where id_producao = ${id}`)
    await connectionPG.query(`update producao set situacao = 4 where id = ${id} returning *`)
      .then(results => { productFinished = results.rows })
    if (id_proximo_processo) {
      await connectionPG.query(`insert into producao
      (id_pedido, id_produto, id_processo, id_usuario, situacao)
      values(${productFinished[0].id_pedido}, ${productFinished[0].id_produto}, ${id_proximo_processo}, 1 , 0)`)
    }
    return res.json().status(200)
  },

  async startManyProductions(req, res) {
    let { checkboxStartProduction } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxStartProduction.length; i++) {
      await connectionPG.query(`update producao set situacao = 1 where id = ${checkboxStartProduction[i]}`)
      await connectionPG.query(`insert into producao_tempo
      (id_producao, inicio)
      values(${checkboxStartProduction[i]}, '${datetime.toISOString()}')`)
    }
    return res.json().status(200)
  },

  async pauseManyProductions(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao set situacao = 2 where id = ${id}`)
    await connectionPG.query(`update producao_tempo set fim = '${datetime.toISOString()}' where id_producao = ${id}`)
    return res.json().status(200)
  },

  /*async resumeManyProductions(req, res) {
    let { checkboxStartProduction } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxStartProduction.length; i++) {
      await connectionPG.query(`update producao set situacao = 1 where id = ${checkboxStartProduction[i]}`)
      await connectionPG.query(`insert into producao_tempo
      (id_producao, inicio)
      values(${checkboxStartProduction[i]}, '${datetime.toISOString()}')`)
    }
    return res.json().status(200)
  },

  async finishProduction(req, res) {
    let { id_proximo_processo } = req.body;
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update producao_tempo set fim = '${datetime.toISOString()}' where id_producao = ${id}`)
    await connectionPG.query(`update producao set situacao = 4 where id = ${id} returning *`)
      .then(results => { productFinished = results.rows })
    if (id_proximo_processo) {
      await connectionPG.query(`insert into producao
      (id_pedido, id_produto, id_processo, id_usuario, situacao)
      values(${productFinished[0].id_pedido}, ${productFinished[0].id_produto}, ${id_proximo_processo}, 1 , 0)`)
    }
    return res.json().status(200)
  }*/

};

