// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
const fs = require("fs");
const express = require("express");
const path = require("path");

// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server. Tells node that we are creating an "express" server
const app = express();
// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

//Sets up the Express app to handle data parsing of HTML, CSS, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ROUTER
// The below points our server to a series of "route" files.
// These routes give our server a "map" of how to respond when users visit or request data from various URLs.

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// POST NOTES
//The post method below, gets the user input and and adds it to the JSON DB and displays it on the client
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    // Using the length of the noteList we're creating a unique ID for each note
    let noteID = (noteList.length).toString();
    newNote.id = noteID;
    //The push method adds newNote to the JSON db
    noteList.push(newNote);
    //Using the File System dependency to write File
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
})

// DELETE NOTES
//The delete method uses the unique ID and deletes 
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = (req.params.id).toString();
    //The filter method creates a new array of notes minus the ones deleted (example note will not be deleted as it doesn't have a unique ID)
    noteList = noteList.filter(selected =>{
        return selected.id != noteID;
    })
    //Using the File System dependency to update noteList
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});

// LISTENER
// The below code effectively "starts" our server

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});