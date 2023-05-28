const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");
const randomNum = uuid.v4();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
