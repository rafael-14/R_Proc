const connectionPG = require('../database/');

//Retorna o ID do último processo de um determinado produto
module.exports = {
    async lastProcess(productID) {
        let lastProcess = []
        if (productID.length > 1) {
            for (let i = 0; i < productID.length; i++) {
                await connectionPG.query(`select id_processo from processos_por_produto
                where id_produto = ${productID[i].id_produto}
                order by sequencia desc limit 1`)
                    .then(results => { lastProcess = [...lastProcess, ...results.rows] })
            }
        } else {
            await connectionPG.query(`select id_processo from processos_por_produto
            where id_produto = ${productID[0].id_produto}
            order by sequencia desc limit 1`)
                .then(results => { lastProcess = results.rows })
        }
        return lastProcess
    }
}