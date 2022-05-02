const connectionPG = require('../database');
const jwt = require("jsonwebtoken");
const secret = "mysecret"

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
  },

  async login(req, res) {
    let { nome } = req.body;
    await connectionPG.query(`select * from setor where nome ilike '${nome}'`)
      .then(results => { login = results.rows })
    if (login[0] === undefined) {
      return res.json({ status: 500 })
    } else {
      const payload = { nome };
      const token = jwt.sign(payload, secret, { expiresIn: '24h' })
      res.cookie('token', token, { httpOnly: true });
      return res.json({ token: token, login: login[0], auth:true, status: 200 })
    }
  }
};