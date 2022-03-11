const connectionPG = require('../database/');

module.exports = {
  async index(req, res) {
    let { listType } = req.body;
    

    await connectionPG.query(`SELECT * FROM empresa 
    ${whereClause}`)
      .then(results => {
        listaEmpresa = results.rows
      })
    return res.json(listaEmpresa)

  }
};