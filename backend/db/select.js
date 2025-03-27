const db = require('./connection');

//Here I create one function for use in insert Uploads and Lines
const select = async (table, values, conditions, order) => {
    
    const sql = `select ${values} from ${table} ${conditions && `where ${conditions.join(" AND ")}`} ${order && `order by ${order}`} `;
    try {
        const [result] = await db.promise().query(sql);
        return result;
      } catch (err) {
        throw err;
      }
}

module.exports = select;