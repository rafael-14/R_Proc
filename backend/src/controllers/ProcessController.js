const connectionPG = require('../database');

module.exports = {
  async selectAllProcesses(req, res) {
    await connectionPG.query(`SELECT * FROM processo order by id`)
      .then(results => {
        allProcesses = results.rows
      })
    return res.json(allProcesses)
  },

  async insertProcess(req, res) {
    let { name } = req.body;
    let insertProcess, datetime = new Date
    let status = 500
    await connectionPG.query(`select * from processo where nome ilike '${name}'`)
      .then(results => { insertProcess = results.rows })
    if (!insertProcess[0]) {
      await connectionPG.query(`insert into processo(nome,data_criacao) values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
        .then(results => { insertProcess = results.rows })
      status = 200
    }
    return res.status(status).json(insertProcess)
  },

  async findProcess(req, res) {
    let { id } = req.params;
    let processFound
    await connectionPG.query(`select * from processo where id = ${id}`)
      .then(results => processFound = results.rows)
    return res.json(processFound)
  },

  async updateProcess(req, res) {
    let { id } = req.params
    let { name } = req.body
    let updatedProcess, status = 500
    await connectionPG.query(`select * from processo where nome ilike '${name}'`)
      .then(results => updatedProcess = results.rows)
    if (!updatedProcess[0]) {
      await connectionPG.query(`update processo set nome='${name}' where id = ${id}`)
        .then(results => updatedProcess = results.rows)
      status = 200
    }
    return res.status(status).json(updatedProcess)
  },

  async activateProcess(req, res) {
    let { id } = req.params;
    let activatedProcess;
    await connectionPG.query(`update processo set ativo=true, data_inativacao=null where id=${id}`)
      .then(results => activatedProcess = results.rows)
    return res.status(200).json(activatedProcess)
  },

  async inactivateProcess(req, res) {
    let { id } = req.params;
    let inactivatedProcess, datetime = new Date;
    await connectionPG.query(`update processo set ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' where id=${id}`)
      .then(results => inactivatedProcess = results.rows)
    return res.status(200).json(inactivatedProcess)
  }
};