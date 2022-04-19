const connectionPG = require('../database/');

module.exports = {
    async nextProcess(productID, processByProduct_Sequence) {
        await connectionPG.query(`select proc_prod.*, proc.nome as nome_proximo_processo, proc.id as id_proximo_processo 
            from processos_por_produto proc_prod
            join processo proc on proc.id = proc_prod.id_processo
            where id_produto = ${productID}
            and sequencia = ${processByProduct_Sequence + 1}`)
            .then(results => { nextProcess = results.rows })
        return nextProcess
    }
}