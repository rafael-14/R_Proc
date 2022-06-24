const connectionPG = require('../database');
const nextProcess = require('../functions/nextProcess');
const processesBySector = require('../functions/processesBySector');

module.exports = {

  async selectProductionNotStarted(req, res) {
    let { id_setor } = req.body;
    await connectionPG.query(`SELECT prodc.*, prod.nome AS nome_produto, proc.nome AS nome_processo, prod_ped.observacao
    FROM producao prodc
    JOIN produto prod ON prod.id = prodc.id_produto
    JOIN processo proc ON proc.id = prodc.id_processo
    JOIN produtos_por_pedido prod_ped ON prod_ped.id = prodc.id_produto_pedido
    WHERE prodc.situacao = 0`)
      .then(results => { productionNotStarted = results.rows })
    for (let i = 0; i < productionNotStarted.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionNotStarted[i].id_produto, productionNotStarted[i].id_processo)
      productionNotStarted[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionNotStarted[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    let dataProcessesBySector = await processesBySector.processesBySector(id_setor)
    let returnProductionNotStarted = []
    for (let i = 0; i < productionNotStarted.length; i++) {
      for (let j = 0; j < dataProcessesBySector.length; j++) {
        if (productionNotStarted[i].id_processo === dataProcessesBySector[j].id_processo) {
          returnProductionNotStarted[returnProductionNotStarted.length] = productionNotStarted[i]
          break
        }
      }
    }
    return res.json(returnProductionNotStarted)
  },

  async selectProductionStarted(req, res) {
    let { id_setor } = req.body;
    await connectionPG.query(`SELECT prodc.*, prod.nome AS nome_produto, proc.nome AS nome_processo,prod_ped.observacao
    FROM producao prodc
    JOIN produto prod ON prod.id = prodc.id_produto
    JOIN processo proc ON proc.id = prodc.id_processo
    JOIN produtos_por_pedido prod_ped ON prod_ped.id = prodc.id_produto_pedido
    WHERE prodc.situacao IN (1, 3)`)
      .then(results => { productionStarted = results.rows })
    for (let i = 0; i < productionStarted.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionStarted[i].id_produto, productionStarted[i].id_processo)
      productionStarted[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionStarted[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    let dataProcessesBySector = await processesBySector.processesBySector(id_setor)
    let returnProductionStarted = []
    for (let i = 0; i < productionStarted.length; i++) {
      for (let j = 0; j < dataProcessesBySector.length; j++) {
        if (productionStarted[i].id_processo === dataProcessesBySector[j].id_processo) {
          returnProductionStarted[returnProductionStarted.length] = productionStarted[i]
          break
        }
      }
    }
    return res.json(returnProductionStarted)
  },

  async selectProductionPaused(req, res) {
    let { id_setor } = req.body;
    await connectionPG.query(`SELECT prodc.*, prod.nome AS nome_produto, proc.nome AS nome_processo, prod_ped.observacao
    FROM producao prodc
    JOIN produto prod ON prod.id = prodc.id_produto
    JOIN processo proc ON proc.id = prodc.id_processo
    JOIN produtos_por_pedido prod_ped ON prod_ped.id = prodc.id_produto_pedido
    WHERE prodc.situacao = 2`)
      .then(results => { productionPaused = results.rows })
    for (let i = 0; i < productionPaused.length; i++) {
      let dataNextProcess = await nextProcess.nextProcess(productionPaused[i].id_produto, productionPaused[i].id_processo)
      productionPaused[i].nome_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].nome)
      productionPaused[i].id_proximo_processo = (dataNextProcess[0] === undefined ? null : dataNextProcess[0].id)
    }
    let dataProcessesBySector = await processesBySector.processesBySector(id_setor)
    let returnProductionPaused = []
    for (let i = 0; i < productionPaused.length; i++) {
      for (let j = 0; j < dataProcessesBySector.length; j++) {
        if (productionPaused[i].id_processo === dataProcessesBySector[j].id_processo) {
          returnProductionPaused[returnProductionPaused.length] = productionPaused[i]
          break
        }
      }
    }
    return res.json(returnProductionPaused)
  },

  async insertProduction(req, res) {
    let { orderID, orderProducts } = req.body;
    for (let i = 0; i < orderProducts.length; i++) {
      for (let j = 0; j < orderProducts[i].productQuantity; j++) {
        await connectionPG.query(`SELECT * FROM processos_por_produto
        WHERE id_produto = ${orderProducts[i].id}
        ORDER BY sequencia
        LIMIT 1`)
          .then(results => processID = results.rows)
        await connectionPG.query(`INSERT INTO producao
      (id_pedido, id_produto, id_processo, id_produto_pedido, situacao)
      VALUES(${orderID}, ${orderProducts[i].id}, ${processID[0].id_processo}, ${orderProducts[i].id_produto_pedido}, 0)`)
      }
    }
    return res.json().status(200)
  },

  async startProduction(req, res) {
    let { id } = req.params;
    let { id_user } = req.body;
    let datetime = new Date
    await connectionPG.query(`UPDATE producao SET situacao = 1 WHERE id = ${id}`)
    await connectionPG.query(`INSERT INTO producao_tempo
    (id_producao, inicio, id_usuario)
    VALUES(${id}, '${datetime.toISOString()}', ${id_user})`)
    return res.json().status(200)
  },

  async pauseProduction(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE producao SET situacao = 2 WHERE id = ${id}`)
    await connectionPG.query(`UPDATE producao_tempo
      SET fim = '${datetime.toISOString()}', interrupcao = true
      WHERE id_producao = ${id}`)
    return res.json().status(200)
  },

  async resumeProduction(req, res) {
    let { id } = req.params;
    let { id_user } = req.body;
    let datetime = new Date
    await connectionPG.query(`UPDATE producao SET situacao = 3 WHERE id = ${id}`)
    await connectionPG.query(`INSERT INTO producao_tempo
    (id_producao, inicio, id_usuario, interrupcao)
    VALUES(${id}, '${datetime.toISOString()}', ${id_user}, true)`)
    return res.json().status(200)
  },

  async finishProduction(req, res) {
    let { paramsIdNextProcess } = req.body;
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE producao_tempo SET fim = '${datetime.toISOString()}' WHERE id_producao = ${id}`)
    await connectionPG.query(`UPDATE producao SET situacao = 4 WHERE id = ${id} RETURNING *`)
      .then(results => { productFinished = results.rows })
    if (paramsIdNextProcess) {
      await connectionPG.query(`INSERT INTO producao
      (id_pedido, id_produto, id_processo, id_produto_pedido, situacao)
      VALUES(${productFinished[0].id_pedido}, ${productFinished[0].id_produto}, ${paramsIdNextProcess}, ${productFinished[0].id_produto_pedido}, 0)`)
    }
    return res.json().status(200)
  },

  async startManyProductions(req, res) {
    let { checkboxStartProduction, id_user } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxStartProduction.length; i++) {
      await connectionPG.query(`UPDATE producao SET situacao = 1 WHERE id = ${checkboxStartProduction[i]}`)
      await connectionPG.query(`INSERT INTO producao_tempo
      (id_producao, inicio, id_usuario)
      VALUES(${checkboxStartProduction[i]}, '${datetime.toISOString()}', ${id_user.id_user})`)
    }
    return res.json().status(200)
  },

  async pauseManyProductions(req, res) {
    let { checkboxPause_FinishProduction } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxPause_FinishProduction.length; i++) {
      await connectionPG.query(`UPDATE producao SET situacao = 2 WHERE id = ${checkboxPause_FinishProduction[i]}`)
      await connectionPG.query(`UPDATE producao_tempo
      SET fim = '${datetime.toISOString()}', interrupcao = true
      WHERE id_producao = ${checkboxPause_FinishProduction[i]}`)
    }
    return res.json().status(200)
  },

  async resumeManyProductions(req, res) {
    let { checkboxResumeProduction, id_user } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxResumeProduction.length; i++) {
      await connectionPG.query(`UPDATE producao SET situacao = 3 WHERE id = ${checkboxResumeProduction[i]}`)
      await connectionPG.query(`INSERT INTO producao_tempo
      (id_producao, inicio, id_usuario, interrupcao)
      VALUES(${checkboxResumeProduction[i]}, '${datetime.toISOString()}', ${id_user.id_user}, true)`)
    }
    return res.json().status(200)
  },

  async finishManyProductions(req, res) {
    let { checkboxPause_FinishProduction, checkboxNextProcesses } = req.body;
    let datetime = new Date
    for (let i = 0; i < checkboxPause_FinishProduction.length; i++) {
      await connectionPG.query(`UPDATE producao_tempo SET fim = '${datetime.toISOString()}'
      WHERE id_producao = ${checkboxPause_FinishProduction[i]}`)
      await connectionPG.query(`UPDATE producao SET situacao = 4
      WHERE id = ${checkboxPause_FinishProduction[i]} RETURNING *`)
        .then(results => { productFinished = results.rows })
      if (checkboxNextProcesses[i]) {
        await connectionPG.query(`INSERT INTO producao
        (id_pedido, id_produto, id_processo, id_produto_pedido, situacao)
        VALUES(${productFinished[0].id_pedido}, ${productFinished[0].id_produto}, ${checkboxNextProcesses[i]}, ${productFinished[0].id_produto_pedido}, 0)`)
      }
    }
    return res.json().status(200)
  },

  async verifyUser(req, res) {
    let { paramsID, id_user } = req.body;
    let status = 400
    await connectionPG.query(`SELECT * FROM producao_tempo
    WHERE id_producao = ${paramsID} AND id_usuario = ${id_user.id_user}`)
      .then(results => { production = results.rows })
    if (production[0]) {
      status = 200
    }
    return res.json({ status })
  },

  async verifyUsers(req, res) {
    let { checkboxPause_FinishProduction, id_user } = req.body;
    let status = 200
    for (let i = 0; i < checkboxPause_FinishProduction.length; i++) {
      await connectionPG.query(`SELECT * FROM producao_tempo
      WHERE id_producao = ${checkboxPause_FinishProduction[i]} AND id_usuario = ${id_user.id_user}`)
        .then(results => { production = results.rows })
      if (!production[0]) {
        status = 400
        break
      }
    }
    return res.json({ status })
  },

  async qrCode(req, res) {
    let { listQrCode } = req.body;
    let idProcesses = [];
    for (let i = 0; i < listQrCode.length; i++) {
      await connectionPG.query(`SELECT * FROM producao
      WHERE id_produto_pedido = ${listQrCode[i]}
      ORDER BY id DESC
      LIMIT 1`)
        .then(results => { idProcesses = [...idProcesses, ...results.rows] })
    }
    return res.json(idProcesses)
  },

};