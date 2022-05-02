const connectionPG = require('../database');

module.exports = {
  async insertUsersBySector(req, res) {
    let { sectorID, vinculatedUser } = req.body;
    let datetime = new Date
    for (let i = 0; i < vinculatedUser.length; i++) {
      await connectionPG.query(`insert into usuarios_por_setor
      (id_setor, id_usuario, data_criacao)
      values(${sectorID}, ${vinculatedUser[i]}, '${datetime.toISOString().slice(0, 10)}')`)
    }
    return res.json().status(200)
  },

  async selectUsersBySector(req, res) {
    let { id } = req.params;
    await connectionPG.query(`SELECT u_setor.*, u.nome, u.sobrenome
      FROM usuarios_por_setor u_setor
      JOIN usuario u on u.id = u_setor.id_usuario where u_setor.id_setor = ${id}`)
      .then(results => { usersBySector = results.rows })
    return res.json(usersBySector)
  },

};