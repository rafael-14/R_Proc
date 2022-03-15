const Process = require('../models/Process')

module.exports = {
  async selectAllProcesses(req, res) {
    return res.json(await Process.find())
  },

  async insertProcess(req, res) {
    let { name } = req.body;
    let datetime = new Date
    let status = 500
    let insertProcess = await Process.findOne({nome:name})
    if (!insertProcess) {
      status = 200
      insertProcess = await Process.create({nome:name, ativo: true, data_criacao:datetime.toISOString().slice(0, 10)})
    }
    return res.json(insertProcess).status(status)
  }
};