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
    await connectionPG.query(`insert into processo(nome,data_criacao) values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcess = results.rows })
    if (!insertProcess[0]) {
      await connectionPG.query(`insert into processo(nome,data_criacao) values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
        .then(results => { insertProcess = results.rows })
      status = 200
    }
    return res.status(status).json(insertProcess)
  }
};