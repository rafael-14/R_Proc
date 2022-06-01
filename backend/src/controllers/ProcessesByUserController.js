const connectionPG = require('../database');

module.exports = {
  async insertProcessesByUser(req, res) {
    let { userID, vinculatedProcess } = req.body;
    let datetime = new Date
    for (let i = 0; i < vinculatedProcess.length; i++) {
      await connectionPG.query(`insert into processos_por_usuario
      (id_usuario, id_processo, data_criacao)
      values(${userID}, ${vinculatedProcess[i]}, '${datetime.toISOString().slice(0, 10)}')`)
    }
    return res.json().status(200)
  },

  async selectProcessesByUser(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT * FROM processos_por_usuario proc_user
    join processo proc on proc.id = proc_user.id_processo
    where proc_user.id_usuario = ${id}`)
      .then(results => { processesByUser = results.rows })
    return res.json(processesByUser)
  },

  async verifyProcessByUser(req, res) {
    let { id, idProcess } = req.body;
    let status = 200
    await connectionPG.query(`SELECT * FROM processos_por_usuario
    where id_usuario = ${id} and id_processo = ${idProcess}`)
      .then(results => { processByUser = results.rows })
    if (processByUser.length === 0) {
      status = 400
    }
    return res.json({ status })
  },

  async verifyProcessesByUser(req, res) {
    let { id, idProcesses } = req.body;
    for (let i = 0; i < idProcesses.length; i++) {
      await connectionPG.query(`SELECT * FROM processos_por_usuario
      where id_usuario = ${id} and id_processo = ${idProcesses[i].idProcess}`)
        .then(results => { processByUser = results.rows })
      if (processByUser.length === 0) {
        return res.json({ status: 400 })
      }
    }
    return res.json({ status: 200 })
  },

};