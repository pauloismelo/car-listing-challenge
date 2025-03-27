const db = require('./connection');
//Here I create one function for use in update Uploads and Lines
const update = async (table, id, data) => {
    
    const updates = Object.keys(data).map((key) => `${key} = ?`).join(", ");
    const values = Object.values(data);
    
    const sql = `update ${table} set ${updates} where id=?`;

    try {
        const res = await db.execute(sql, [...values, id]); 
        return res ? id : null; 
    } catch (err) {
        console.log('Erro ao atualizar:', err);
        throw err;
    }
    
}
module.exports = update;