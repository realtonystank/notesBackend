const express = require("express");
const cors = require("cors");
const app = express();
let notes = [
  { id: 1, content: "HTML is easy", important: true },
  { id: 2, content: "Browser can execute only JavaScript", important: false },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId = Math.max(...notes.map((note) => note.id));
  return maxId + 1;
};

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.get("/api/notes", (req, res) => {
  res.json(notes);
});
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const resource = notes.find((note) => note.id === id);
  if (resource) {
    res.json(resource);
  } else {
    res.status(404).send("Not found!");
  }
});

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  }
  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
  };
  notes = notes.concat(note);
  res.json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedNote = req.body;
  notes = notes.map((n) => (n.id !== id ? n : updatedNote));
  res.status(200).json(updatedNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
