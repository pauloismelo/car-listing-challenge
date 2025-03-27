# Overview
For this project I'm creating a basic and objetive system showing different ways to solve the same problem. 
I'm commenting all files with my way of think.

As requested me, I had focus in the layout using Tailwind css and other libraries, like 'react-toastify' for create a good interface and experience for users

for keep best practices in my code, I configurated editorConfig, Eslint and prettier

For keep my system safe, I used security files (.env) for save credentials

For keep a good organization, I created 2 different folders (frontend/backend) with different dependencies and configurations. 
Because of this, we have 2 instructions for setup:
# Instructions for Front end: 
<ol>
    <li>Install dependencies using npm: npm install</li>
    <li>Run server using npm: npm run dev</li>
    <li>port: 3000 (default)</li>
</ol>

# Instructions for  Back end: 
<ol>
    <li>Install dependencies using npm: npm install</li>
    <li>Run server using npm: npm run start (using nodemon for see the server.js file in real time)</li>
    <li>port: 4000 (configured)</li>
</ol>



# Dependencies in Front end
<ul>
    <li>axios</li>
    <li>tailwind</li>
    <li>react-toastify</li>
    <li>fontawesome</li>
</ul>

# Dependencies in Back end
<ul>
    <li>express</li>
    <li>multer</li>
    <li>xlsx</li>
    <li>fs</li>
    <li>path</li>
    <li>cors</li>
    <li>mysql2</li>
</ul>

# Database
I choose MySql for this project. It isn't a technicall decision. It's just because I have Workbench installed in my computer.So it's easier for me

I created 2 tables: 
1 - Uploads (Id, fileName, RegisterDate, Status)
2- Lines (Id, IdUpload, make, model, year, price, mileage, color, vin)

I save all uploads in the Uploads table e just valid Lines in the Lines tables. 
With the records in the lines table, I allow the user to resend the spreadsheet and correct the lines that were previously in error.

With each correction submission, I check to see if there are any more error rows in the database. If there are none, I change the upload status to "success".
This allows the user to submit the spreadsheet multiple times until all rows are corrected. This includes the ability for the user to add rows to the spreadsheet and submit while the Upload status is 'Pendent'.


# Future improvements

With more time, I would like to improve this system with this steps bellow:
<ul>
    <li>Unity tests using Jest</li>
    <li>Global state for manage uploads state (Redux or ContextApi)</li>
    <li>Drag&Drop for upload file</li>
    <li>Users authentication (login page, logout) using JsonWebToken</li>
    <li>With dataUsers, I would like to send reports for email of the user</li>
    <li>Maybe a cronjobs for reminder the users about Pendent uploads</li>
    <li>Pagination in the APIs</li>
</ul>


# p.s.:
The color 'green-950' was chosed because the Knowtrex logo 