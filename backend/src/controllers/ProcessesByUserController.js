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
  }
  
};