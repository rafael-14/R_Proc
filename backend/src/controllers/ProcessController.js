const connectionPG = require('../database/');

module.exports = {
  async selectAllProcesses(req, res) {
    await connectionPG.query(`SELECT * FROM processo`)
      .then(results => {
        allProcesses = results.rows
      })
    return res.json(allProcesses)
  },

  async insertProcess(req, res) {
    let { name } = req.body;
    let insertProcess, datetime = new Date
    await connectionPG.query(`insert into processo(nome,ativo,data_criacao) values('${name}',true, '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcess = results.rows })
    return res.json(insertProcess).status(200)
  }
};