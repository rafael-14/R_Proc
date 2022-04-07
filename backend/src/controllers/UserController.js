const connectionPG = require('../database');

module.exports = {
  async selectAllUsers(req, res) {
    await connectionPG.query(`SELECT * FROM usuario order by 1`)
      .then(results => { allProcesses = results.rows })
    return res.json(allProcesses)
  },

  async insertUser(req, res) {
    let { userName, userSurname, userLogin, userPassword } = req.body;
    let datetime = new Date
    await connectionPG.query(`insert into usuario
      (nome, sobrenome, login, senha, data_criacao)
      values('${userName}', '${userSurname}', '${userLogin}', '${userPassword}', '${datetime.toISOString().slice(0, 10)}')`)
    await connectionPG.query(`select * from usuario where login = '${userLogin}'`)
      .then(results => { insertUser = results.rows })
    return res.json(insertUser[0]).status(200)
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