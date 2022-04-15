const connectionPG = require('../database/');

module.exports = {
    async nextProcess(productID, processByProduct_Sequence) {
        await connectionPG.query(`select * from processos_por_produto
            where id_produto = ${productID}
            and sequencia = ${processByProduct_Sequence+1}`)
                .then(results => { nextProcess = results.rows })
        return nextProcess
    }
}