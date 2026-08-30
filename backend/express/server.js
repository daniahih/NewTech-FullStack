import express from "express";
import fs from "fs";
import morgan from "morgan";
const app = express();
const PORT = 3000;

app.use(morgan("dev"));

app.get("/", (req, res) => {
  const data = fs.readFileSync("message.txt", "utf-8");
  console.log(data);
  res.send(data);
});

app.get("/create-file", (req, res) => {
  fs.writeFile("message.txt", "This file was created by Node.js", (error) => {
    if (error) {
      return res.status(500).send("Could not create file");
    }

    res.send("File created successfully");
  });
});
app.get("/create-file-sync", (req, res) => {
  // This blocks until the file is completely written.
  fs.writeFileSync("sync-file.txt", "Created synchronously");

  res.send("Sync file created");
});

app.get("/about", (req, res) => {
  res.send("hello from about");
});
app.get("/moives", (req, res) => {
  const movies = [
    {
      id: 1,
      title: "Interstellar",
    },
    {
      id: 2,
      title: "Inception",
    },
  ];
  res.json(movies);
});

app.listen(PORT, () => {
  console.log(`server ruuning on http://localhost:${PORT}`);
});
