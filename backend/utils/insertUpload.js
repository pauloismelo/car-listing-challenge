const insert = require("../db/insert"); //function for insert data in database

async function insertUpload(filename){
    const actualDate= new Date().toISOString().split('T')[0];
    try{
        const currentId = await insert('Uploads', ["fileName", "status", "RegisterDate"], ["'"+filename+"'", "'Pendent'", "'"+actualDate+"'"]);
        return currentId;
    }catch(err){
      throw err;
    }
  }

  module.exports = insertUpload;