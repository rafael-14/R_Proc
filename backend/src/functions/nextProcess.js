const connectionPG = require('../database/');

module.exports = {
    async nextProcess(productID, processID) {
        await connectionPG.query(`select * from processos_por_produto proc_prod
            join processo proc on proc.id = proc_prod.id_processo
            where id_produto = ${productID}
            and id_processo = ${processID}`)
            .then(results => { nextProcess = results.rows })
        for (let i = 0; i < nextProcess.length; i++) {
            await connectionPG.query(`select * from processos_por_produto proc_prod
                join processo proc on proc.id = proc_prod.id_processo
                where id_produto = ${productID}
                and sequencia = ${nextProcess[i].sequencia + 1}`)
                .then(results => { nextProcess = results.rows })
        }
        
        return nextProcess
    }
}