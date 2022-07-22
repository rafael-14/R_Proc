const connectionPG = require('../database/');

//Retorna o ID do último processo de um determinado produto
module.exports = {
    async lastProcess(productID) {
        let lastProcess = []
        if (productID.length > 1) {
            for (let i = 0; i < productID.length; i++) {
                await connectionPG.query(`SELECT proc_prod.id_processo
                    FROM processos_por_produto proc_prod
                    JOIN processo proc ON proc.id = proc_prod.id_processo
                    WHERE proc_prod.id_produto = ${productID[i].id_produto}
                    AND proc.bipagem = 1
                    ORDER BY proc_prod.sequencia DESC
                    LIMIT 1`)
                    .then(results => { lastProcess = [...lastProcess, ...results.rows] })
            }
        } else {
            await connectionPG.query(`SELECT proc_prod.id_processo
                FROM processos_por_produto proc_prod
                JOIN processo proc ON proc.id = proc_prod.id_processo
                WHERE proc_prod.id_produto = ${productID[0].id_produto}
                AND proc.bipagem = 1
                ORDER BY proc_prod.sequencia DESC
                LIMIT 1`)
                .then(results => { lastProcess = results.rows })
        }
        return lastProcess
    }
}