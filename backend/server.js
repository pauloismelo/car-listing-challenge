const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const db = require('./db/connection');

const insertUpload = require("./utils/insertUpload"); //function for insert upload in database


const app = express();
const port = 4000;

app.use(cors()); // allow request from frontend. here I could specify the origin and other options for keep my system safe
app.use(express.json());

//routes
const uploads = require("./routes/uploads");
app.use("/uploads", uploads);
const registers = require("./routes/registers");
app.use("/registers", registers);

// I use multer to upload the file. Here I specify the destination folder and the filename
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); //here i pu date for allow the users send the same file
  },
});
const upload = multer({ 
  storage , 
  limits: { fileSize: 10 * 1024 * 1024 }, // Requirement: File size should be less than 10MB
});

/*
Here I could create a manual verification of the size, like: 
  if (req.file.size > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "File size too large" });
  }
But, I prefer to use the own multer configuration for this
*/


// Endpoint for upload and file process - here I will read the file and validate the data
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    async function WaitingUpload(){
      try{
        //save upload in the database | This function I put in another file for better organization
        const currentId = await insertUpload(req.file.filename);

        const errors= [];
        const validRows = [];

        for (const row of data) {
          if (!row.make || !row.model || !row.year || !row.price || !row.mileage || !row.vin) {
            errors.push({...row, Error: "field Required"});
          }else{
            validRows.push([row.make, row.model, row.year, row.price, row.mileage, row.color, row.vin]);
          }
        }

        for (let row of validRows){
          await db.promise().query('INSERT INTO registers (idupload, make, model, year, price, mileage, color, vin) VALUES (?,?,?,?,?,?,?,?)', [ currentId, row[0], row[1], row[2], row[3], row[4], row[5], row[6]]);
        }
       

        if (errors.length === 0) {
      
          fs.unlinkSync(filePath); // Delete original file if no errors found
          res.status(200).json({type: "success", message: "Congratulations! No errors found" });
          //if no errors found, I will update the status of the upload
          await db.promise().query("update Uploads set status='Success' where id=?", [ currentId]);

        }else{ //If errors found, I will create a new file with the errors

          // Create a new file with the errors
          const newWorkbook = xlsx.utils.book_new();
          const newWorksheet = xlsx.utils.json_to_sheet(errors);

          // Applying styles to cells with errors
          const range = xlsx.utils.decode_range(newWorksheet['!ref']); // Get the range of the worksheet
          
          for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cell_address = { r: row, c: col };
              const cell_ref = xlsx.utils.encode_cell(cell_address);
              
              if (errors[row] && errors[row].Erros && errors[row].Erros.includes("Required")) {
                if (!newWorksheet[cell_ref]) newWorksheet[cell_ref] = {}; // Ensure the cell exists
                newWorksheet[cell_ref].s = { fill: { fgColor: { rgb: "FF0000" } } }; // Red background
              }
            }
          }
          //End  Applying styles to cells with errors


          xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "errors");

          const errorFilePath = `uploads/errors-${Date.now()}.xlsx`; //Here I create a new file with the errors. e.g:"errors-03262025"
          xlsx.writeFile(newWorkbook, errorFilePath); //write the file in server

          res.download(errorFilePath, "errors.xlsx", () => {
            fs.unlinkSync(errorFilePath); // delete the error file after the download for save space in the server
            fs.unlinkSync(filePath); // delete the original file
          });
        }

      }catch(err){
        throw err;
      }
    }

    
    WaitingUpload();

    

    

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error processing file" });
  }
});


// Endpoint for resend file with corrections
app.post("/resend/:currentId", upload.single("file"), (req, res) => {
  try {
    const filePath = req.file.path;
    const {currentId} = req.params;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    async function WaitingUpload(){
      try{
        const errors= [];
        const validRows = [];

        for (const row of data) {
          if (!row.make || !row.model || !row.year || !row.price || !row.mileage || !row.vin) {
            errors.push({...row, Error: "field Required"});
          }else{
            validRows.push([row.make, row.model, row.year, row.price, row.mileage, row.color, row.vin]);
          }
        }
        

        for (let row of validRows){
          const returnSelect = await db.promise().query('Select id from registers where idupload=? and make=? and model=? and year=? and price=? and mileage=? and color=? and vin=?', [ currentId, row[0], row[1], row[2], row[3], row[4], row[5], row[6]]);
          if (!returnSelect){ //block if I found the same line in the database
            await db.promise().query('INSERT INTO registers (idupload, make, model, year, price, mileage, color, vin) VALUES (?,?,?,?,?,?,?,?)', [ currentId, row[0], row[1], row[2], row[3], row[4], row[5], row[6]]);
          }
        }
       

        if (errors.length === 0) {
      
          fs.unlinkSync(filePath); // Delete original file if no errors found
          res.status(200).json({type: "success", message: "Congratulations! No errors found" });
          //Here, I will update the status only when all rows are correct. Otherwise, I will allow the user to try as many times as necessary until the result is successful.
          //This also includes the situation where the user can add more rows to the spreadsheet while the status is different from 'Success'.
          await db.promise().query("update Uploads set status='Success' where id=?", [ currentId]);

        }else{ //If errors found, I will create a new file with the errors

          // Create a new file with the errors
          const newWorkbook = xlsx.utils.book_new();
          const newWorksheet = xlsx.utils.json_to_sheet(errors);

          // Applying styles to cells with errors
          const range = xlsx.utils.decode_range(newWorksheet['!ref']); // Get the range of the worksheet
          
          for (let row = range.s.r; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cell_address = { r: row, c: col };
              const cell_ref = xlsx.utils.encode_cell(cell_address);
              
              if (errors[row] && errors[row].Erros && errors[row].Erros.includes("Required")) {
                if (!newWorksheet[cell_ref]) newWorksheet[cell_ref] = {}; // Ensure the cell exists
                newWorksheet[cell_ref].s = { fill: { fgColor: { rgb: "FF0000" } } }; // Red background
              }
            }
          }
          //End  Applying styles to cells with errors


          xlsx.utils.book_append_sheet(newWorkbook, newWorksheet, "errors");

          const errorFilePath = `uploads/errors-${Date.now()}.xlsx`; //Here I create a new file with the errors. e.g:"errors-03262025"
          xlsx.writeFile(newWorkbook, errorFilePath); //write the file in server

          res.download(errorFilePath, "errors.xlsx", () => {
            fs.unlinkSync(errorFilePath); // delete the error file after the download for save space in the server
            fs.unlinkSync(filePath); // delete the original file
          });
        }

      }catch(err){
        throw err;
      }
    }

    
    WaitingUpload();

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error processing file" });
  }
});

app.listen(port, () => console.log(`Server runs in port ${port}`));
