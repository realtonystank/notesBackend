require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/noteModel");
const app = express();

app.use(express.static("./build"));
app.use(express.json());
app.use(cors());

app.get("/api/notes", (req, res) => {
  Note.find({}).then((result) => {
    res.json(result);
  });
});
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) res.json(note);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  const updatedNote = {
    content: req.body.content,
    important: req.body.important,
  };
  Note.findByIdAndUpdate(req.params.id, updatedNote, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result === null) {
        return res.status(404).json({ error: "already deleted" });
      }
      res.status(204).end();
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Malformatred id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});
