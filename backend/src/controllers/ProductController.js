const connectionPG = require('../database');

module.exports = {
  async selectAllProducts(req, res) {
    await connectionPG.query(`SELECT prod.*, proc1.nome as nome_processo1, proc2.nome as nome_processo2, proc3.nome as nome_processo3,
    proc4.nome as nome_processo4, proc5.nome as nome_processo5, proc6.nome as nome_processo6, proc7.nome as nome_processo7,
    proc8.nome as nome_processo8, proc9.nome as nome_processo9, proc10.nome as nome_processo10	
    
    FROM produto prod
  
    left join processos_por_produto ppp on ppp.id_produto = prod.id left join processo proc1 on proc1.id = ppp.id_processo1
    left join processo proc2 on proc2.id = ppp.id_processo2 left join processo proc3 on proc3.id = ppp.id_processo3
    left join processo proc4 on proc4.id = ppp.id_processo4 left join processo proc5 on proc5.id = ppp.id_processo5
    left join processo proc6 on proc6.id = ppp.id_processo6 left join processo proc7 on proc7.id = ppp.id_processo7
    left join processo proc8 on proc8.id = ppp.id_processo8 left join processo proc9 on proc9.id = ppp.id_processo9
    left join processo proc10 on proc10.id = ppp.id_processo10
    
    order by prod.id`)
      .then(results => {
        allProducts = results.rows
      })
    return res.json(allProducts)
  },

  async insertProduct(req, res) {
    let { name } = req.body;
    let insertProduct, datetime = new Date
    let status = 500
    await connectionPG.query(`select * from produto where nome ilike '${name}'`)
      .then(results => { insertProduct = results.rows })
    if (!insertProduct[0]) {
      await connectionPG.query(`insert into produto(nome,data_criacao) values('${name}', '${datetime.toISOString().slice(0, 10)}')`)
        .then(results => { insertProduct = results.rows })
      status = 200
    }
    return res.status(status).json(insertProduct)
  },

  async findProduct(req, res) {
    let { id } = req.params;
    let productFound
    await connectionPG.query(`select * from produto where id = ${id}`)
      .then(results => productFound = results.rows)
    return res.json(productFound)
  },

  async updateProduct(req, res) {
    let { id } = req.params
    let { name } = req.body
    let updatedProduct, status = 500
    await connectionPG.query(`select * from produto where nome ilike '${name}'`)
      .then(results => updatedProduct = results.rows)
    if (!updatedProduct[0]) {
      await connectionPG.query(`update produto set nome='${name}' where id = ${id}`)
        .then(results => updatedProduct = results.rows)
      status = 200
    }
    return res.status(status).json(updatedProduct)
  },

  async activateProduct(req,res) {
    let {id} = req.params;
    let activatedProduct;
    await connectionPG.query(`update produto set ativo=true, data_inativacao=null where id=${id}`)
      .then(results => activatedProduct = results.rows)
    return res.status(200).json(activatedProduct)
  },

  async inactivateProduct(req,res) {
    let {id} = req.params;
    let inactivatedProduct, datetime = new Date;
    await connectionPG.query(`update produto set ativo=false, data_inativacao='${datetime.toISOString().slice(0, 10)}' where id=${id}`)
      .then(results => inactivatedProduct = results.rows)
    return res.status(200).json(inactivatedProduct)
  }
};