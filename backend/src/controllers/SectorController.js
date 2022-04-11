const connectionPG = require('../database');

module.exports = {
  async selectAllSectors(req, res) {
    await connectionPG.query(`SELECT * FROM setor order by 1`)
      .then(results => { allSectors = results.rows })
    return res.json(allSectors)
  },

  async insertSector(req, res) {
    let { sector } = req.body;
    let datetime = new Date
    await connectionPG.query(`insert into setor
      (nome, data_criacao)
      values('${sector}', '${datetime.toISOString().slice(0, 10)}')
      returning *`).then(results => { insertSector = results.rows })
    return res.json(insertSector[0]).status(200)
  }
};