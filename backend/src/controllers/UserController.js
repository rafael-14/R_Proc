const connectionPG = require('../database');

module.exports = {
  async selectAllUsers(req, res) {
    await connectionPG.query(`SELECT * FROM usuario order by 1`)
      .then(results => { allProcesses = results.rows })
    return res.json(allProcesses)
  },

  async insertUser(req, res) {
    let { userName, userSurname, userLogin, userPassword } = req.body;
    let insertProcess, datetime = new Date
    await connectionPG.query(`insert into processo
      (nome, sobrenome, login, senha, data_criacao)
      values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
      .then(results => { insertProcess = results.rows })
    return res.json(insertProcess).status(200)
  },

  async inactivateUser(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`update processo set ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' where id = ${id}`)
    return res.json().status(200)
  },

  async activateUser(req, res) {
    let { id } = req.params;
    await connectionPG.query(`update processo set ativo=true, data_inativacao=null where id = ${id}`)
    return res.json().status(200)
  }
};