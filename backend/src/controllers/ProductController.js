const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    let { product, page } = req.body;
    await connectionPG.query(`SELECT * FROM produto 
    ${product ? `WHERE nome ILIKE '%${product}%'` : ""}
    ORDER BY nome
    LIMIT 10 OFFSET 10 * ${page - 1}`)
      .then(results => { allProducts = results.rows })
    await connectionPG.query(`SELECT COUNT(id) FROM produto`)
      .then(results => count = results.rows[0].count)
    return res.json({ allProducts, count })
  },

  async insertProduct(req, res) {
    let { productName } = req.body;
    let datetime = new Date
    await connectionPG.query(`INSERT INTO produto(nome,data_criacao)
    VALUES('${productName}', '${datetime.toISOString().slice(0, 10)}')
    RETURNING *`).then(results => { insertProduct = results.rows })
    return res.json(insertProduct[0]).status(200)
  },

  async inactivateProduct(req, res) {
    let { id } = req.params;
    let datetime = new Date
    await connectionPG.query(`UPDATE produto
    SET ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}'
    WHERE id = ${id}`)
    return res.json().status(200)
  },

  async activateProduct(req, res) {
    let { id } = req.params;
    await connectionPG.query(`UPDATE produto SET ativo=true, data_inativacao=null
    WHERE id = ${id}`)
    return res.json().status(200)
  },

  async findProduct(req, res) {
    let { product } = req.body;
    await connectionPG.query(`SELECT * FROM produto 
    WHERE nome ILIKE '${product}'`)
      .then(results => productFound = results.rows)
    return res.json(productFound)
  }
};