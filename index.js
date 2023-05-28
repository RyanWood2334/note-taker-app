const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const randomId = uuid.v4();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//create a function that creates an ID number using uuid, so that we can use it in routes later
function generateRandomId() {
  const newNoteId = randomId.slice(0, 4);

  return newNoteId;
}

//route to get all notes from the db.json
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, notesData) => {
    if (err) {
      return res.status(500).json({ msg: "couldnt read db!" });
    } else {
      const dataArr = JSON.parse(notesData);
      return res.json(dataArr);
    }
  });
});

//route to create notes, reads db first, and then writes file by taking in request body (title and text), and adds it to the db.json
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ msg: "couldnt read db!" });
    } else {
      const dataArr = JSON.parse(data);
      const newNote = {
        id: generateRandomId(),
        title: req.body.title,
        text: req.body.text,
      };
      console.log(newNote);
      dataArr.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(dataArr, null, 4), (err) => {
        if (err) {
          return res.status(500).json({ msg: "couldnt write to db!" });
        } else {
          return res.json(newNote);
        }
      });
    }
  });
});

//deletes a specific note by reading the db.json, isolating the id that is in the params, and then splice out the isolated index, and then re-writes the json
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ msg: "couldnt read db!" });
    } else {
      const notes = JSON.parse(data);
      const noteID = req.params.id;
      const noteIndex = notes.findIndex((note) => note.id == noteID);
      if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        fs.writeFile("./db/db.json", JSON.stringify(notes, null, 4), (err) => {
          if (err) {
            return res.status(500).json({ msg: "couldnt write to db" });
          } else {
            return res.json({
              msg: "note deleted!",
            });
          }
        });
      } else {
        return res.status(404).json({
          msg: "no such note!",
        });
      }
    }
  });
});

//needs to read after routes, so put at the bottom of page
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
