const connectionPG = require('../database');
const jwt = require("jsonwebtoken");
const secret = "mysecret"

module.exports = {
  async selectAllSectors(req, res) {
    let { sector, page } = req.body;
    await connectionPG.query(`SELECT * FROM setor
    ${sector ? `WHERE nome ILIKE '%${sector}%'` : ""}
    ORDER BY nome
    LIMIT 10 OFFSET 10 * ${page - 1}`)
      .then(results => { allSectors = results.rows })
    await connectionPG.query(`SELECT COUNT(id) FROM setor`)
      .then(results => count = results.rows[0].count)
    return res.json({ allSectors, count })
  },

  async insertSector(req, res) {
    let { sector } = req.body;
    let datetime = new Date
    await connectionPG.query(`INSERT INTO setor
      (nome, data_criacao)
      VALUES('${sector}', '${datetime.toISOString().slice(0, 10)}')
      RETURNING *`).then(results => { insertSector = results.rows })
    return res.json(insertSector[0]).status(200)
  },

  async login(req, res) {
    let { nome } = req.body;
    await connectionPG.query(`SELECT * FROM setor WHERE nome ILIKE '${nome}'`)
      .then(results => { login = results.rows })
    if (login[0] === undefined) {
      return res.json({ status: 500 })
    } else {
      const payload = { nome };
      const token = jwt.sign(payload, secret, { expiresIn: '24h' })
      res.cookie('token', token, { httpOnly: true });
      return res.json({ token: token, login: login[0], auth: true, status: 200 })
    }
  },

  async checkToken(req, res) {
    let status = 401
    const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
    if (token) {
      try {
        jwt.verify(token, secret)
        status = 200
      } catch (e) {
        res.cookie('token', null, { httpOnly: true })
      }
    }
    res.json({ status })
  },

  async destroyToken(req, res) {
    const token = req.headers.token;
    if (token) {
      res.cookie('token', null, { httpOnly: true }).json();
    }
  }
};