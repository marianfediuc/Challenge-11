const { json } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");
const notes = require("./db/db.json");

const PORT = process.env.PORT || 3002;
const app = express();

// Middleware for parsing JSON and urlencoded form data. Middleware is anything that sits between the front end and the server and accepts requests and sends responses
//middleware to make sure things are in the json format
app.use(express.json());
//middleware that informs the system we are passing variables and info through the urls, and it should pay attention to those
app.use(express.urlencoded({ extended: true }));
//middleware that informs the system that all of our public facing code lives in the public folder
app.use(express.static("public"));

// GET route for api/notes
// app.get('/api/notes', (req,res) => {
//     console.info(`${req.method} request received for notes`);
//      res.json(notes);
// })

app.get("/api/notes", (req, res) => {
  //reads the db.json file
  const test = fs.readFileSync("./db/db.json", "utf8");
  //console.log to ensure its working (it is)
  console.log(test);
  const test2 = JSON.parse(test);
  console.log(test2);
  res.json(test2);
});

app.post("/api/notes", (req, res) => {
  //logs that post request was received
  console.info(`${req.method} request received for notes`);
  //destructuring assignment for the items in req.body
  const { text, title} = req.body;
  if (text && title) {
    const newNote = {text,title}
    fs.readFileSync('./db/db.json', 'utf8', (err,data) => {
        if (err) {
            console.error(err)
        } else {
            const parsedNotes = JSON.parse(data);
            parsedNotes.push(newNote)
            fs.writeFileSync('./db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
            writeErr
            ? console.error(writeErr)
            : console.info('success')
            );
        };
    });
    const response = {
        status: 'success',
        body: newNote,
    };
    res.json(newNote)
    }
  })

// ********HTML ROUTES***********
// HTML home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);