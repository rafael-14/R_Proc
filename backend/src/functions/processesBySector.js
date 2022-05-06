const connectionPG = require('../database/');

module.exports = {
    async processesBySector(id_setor) {
        await connectionPG.query(`select proc_user.id_processo
        from usuarios_por_setor user_set
        join processos_por_usuario proc_user on proc_user.id_usuario = user_set.id_usuario
        where user_set.id_setor = ${id_setor}`)
            .then(results => {processesBySector = results.rows })
        return processesBySector
    }
}
