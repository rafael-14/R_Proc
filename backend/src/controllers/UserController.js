const connectionPG = require('../database');

module.exports = {
  async selectAllUsers(req, res) {
    await connectionPG.query(`SELECT * FROM usuario ORDER BY 1`)
      .then(results => { allProcesses = results.rows })
    return res.json(allProcesses)
  },

  async insertUser(req, res) {
    let { userName, userSurname, userLogin, userPassword } = req.body;
    let datetime = new Date
    await connectionPG.query(`INSERT INTO usuario
      (nome, sobrenome, login, senha, data_criacao)
      VALUES('${userName}', '${userSurname}', '${userLogin}', '${userPassword}', '${datetime.toISOString().slice(0, 10)}')
      RETURNING *`).then(results => { insertUser = results.rows })
    return res.json(insertUser[0]).status(200)
  },

  async inactivateUser(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE processo SET ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' WHERE id = ${id}`)
    return res.json().status(200)
  },

  async activateUser(req, res) {
    let { id } = req.params;
    await connectionPG.query(`UPDATE processo SET ativo=true, data_inativacao=null WHERE id = ${id}`)
    return res.json().status(200)
  },

  async userByCode(req, res) {
    let { code } = req.body;
    let status = 400
    await connectionPG.query(`SELECT * FROM usuario WHERE senha = '${code}'`)
      .then(results => { userByCode = results.rows })
    if (userByCode[0] !== undefined) {
      status = 200
      //await connectionPG.query(`select * from usuario where senha = '${code}'`)
      //  .then(results => { userByCode = results.rows })
    }
    return res.json({ userByCode, status })
  }
};