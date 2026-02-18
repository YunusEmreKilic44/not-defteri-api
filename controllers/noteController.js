const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const notesPath = path.join(__dirname, "..", "models", "notes.json");

const getAllNotes = async (req, res) => {
  const data = await fs.readFile(notesPath, "utf-8");
  const notes = JSON.parse(data);

  res.json(notes);
};

const createNote = async (req, res) => {
  const data = await fs.readFile(notesPath, "utf-8");
  const notes = JSON.parse(data);

  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Title ve content alanları zorunlu" });
  }

  const newNote = {
    id: uuid(),
    title,
    content,
  };

  notes.push(newNote);
  await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));

  res.status(201).json(newNote);
};

const deleteNote = async (req, res) => {
  const data = await fs.readFile(notesPath, "utf-8");
  let notes = JSON.parse(data);

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Id parametresi zorunlu!" });
  }

  notes = notes.filter((note) => note.id !== id);
  await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));

  res.json({ message: "Not silindi!" });
};

module.exports = {
  getAllNotes,
  createNote,
  deleteNote,
};
