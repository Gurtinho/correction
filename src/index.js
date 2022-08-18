const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();
app.use(express.json());

const repositories = [];

function findRepositoryIndex(request, response, next) {
  const { id } = request.params;
  const repository = repositories.findIndex(repository => repository.id === id);
  if (repository == -1) {
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repository = repository;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }
  repository.title = title;
  repository.url = url;
  repository.techs = techs;
  return response.status(201).json(repository);
});

app.delete("/repositories/:id", findRepositoryIndex, (request, response) => {
  repositories.splice(request.repository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepositoryIndex, (request, response) => {
  const likes = request.repository.likes++;
  return response.json(likes);
});

module.exports = app;
