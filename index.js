import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Configuração do EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let posts = [];

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.post("/post", (req, res) => {
  const { title, content } = req.body;
  const post = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date(),
  };
  // Lógica para salvar o post (em memória, banco de dados, etc.)
  posts.push(post);
  res.redirect("/");
});

app.get("/post/:id", (req, res) => {
  const { id } = req.params;
  const post = posts.find((p) => p.id === id);
  if (post) {
    res.render("post.ejs", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

// Editar post
app.get("/post/:id/edit", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) {
    res.render("edit", { post });
  } else {
    res.redirect("/");
  }
});

// Salvar edição
app.post("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
  }
  res.redirect("/");
});

// Deletar post
app.post("/post/:id/delete", (req, res) => {
  posts = posts.filter((p) => p.id !== req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server on ${port}`);
});
