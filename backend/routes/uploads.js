const app = require('express')
const router = app.Router();

const select = require("../db/select"); //function for update data in database

router.get("/", (req, res) => {
    //Here, I get just uploads. but I could get the lines too.
    //If we have several fields, this way need to be improved. Add pagination, for ex
    
    select('Uploads', '*', '', 'id DESC')
    .then((result) => {
      res.status(200).json(result);
    }).catch((err) => { 
      res.status(500).json({type: "error", message: "Error in select function" });
    })
    
  });

  module.exports = router;