const connectionPG = require('../database');

module.exports = {
  async selectAllProcesses(req, res) {
    await connectionPG.query(`SELECT * FROM processo order by 1`)
      .then(results => {
        allProcesses = results.rows
      })
    return res.json(allProcesses)
  },

  async insertProcess(req, res) {
    let { processName } = req.body;
    let insertProcess, datetime = new Date
    await connectionPG.query(`insert into processo(nome,data_criacao) values('${processName}', '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcess = results.rows })
      console.log(insertProcess)
    return res.json(insertProcess).status(200)
  },

  async inactivateProcess(req, res) {
    let {id} = req.params;
    let datetime = new Date
    await connectionPG.query(`update processo set ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' where id = ${id}`)
    return res.json().status(200)
  },
  
  async activateProcess(req, res) {
    let {id} = req.params;
    await connectionPG.query(`update processo set ativo=true, data_inativacao=null where id = ${id}`)
    return res.json().status(200)
  }
};