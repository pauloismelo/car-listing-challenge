const db = require('./connection');

//Here I create one function for use in insert Uploads and Lines
const insert = async (table, values, data) => {
    const sql = `INSERT INTO ${table} (${values.join(",")}) VALUES (${data.join(",")})`;

    try {
        const [result] = await db.promise().query(sql, [...data]);
        return result.insertId;
      } catch (err) {
        throw err;
      }
}

module.exports = insert;