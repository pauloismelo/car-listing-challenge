const app = require('express')
const router = app.Router();

const select = require("../db/select"); //function for update data in database

router.get("/:id", (req, res) => {
    const {id} = req.params;
    const uploadsConditions = [`id=${id}`];
    const registersConditions = [`idupload=${id}`];

    select('uploads', '*', uploadsConditions, '')
    .then((result) => {

      select('registers', '*', registersConditions, 'id DESC')
      .then((result2) => {
        const objectReturn ={
          id: result[0].id,
          filename: result[0].fileName,
          registerDate: result[0].RegisterDate,
          status: result[0].status,
          registers: result2
        }
        res.status(200).json(objectReturn);
      }).catch((err) => { 
        res.status(500).json({type: "error", message: "Error in find register" });
      })

    }).catch((err) => { 
      res.status(500).json({type: "error", message: "Error in find upload" });
    })
    
  });

  module.exports = router;