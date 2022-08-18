const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();
app.use(express.json());

const repositories = [];

function findRepository(request, response, next) {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repository = repository;
  return next();
};

function findRepositoryIndex(request, response, next) {
  const { id } = request.params;
  const repository = repositories.findIndex(repository => repository.id === id);
  if (repository == -1) {
    return response.status(404).json({ error: "Repository not found" });
  }
  request.repository = repository;
  return next();
};

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

app.put("/repositories/:id", findRepository, (request, response) => {
  const { title, url, techs } = request.body;
  request.repository.title = title;
  request.repository.url = url;
  request.repository.techs = techs;
  return response.status(201).json(request.repository);
});

app.delete("/repositories/:id", findRepositoryIndex, (request, response) => {
  repositories.splice(request.repository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", findRepository, (request, response) => {
  const likes = request.repository.likes++;
  return response.json(likes);
});

module.exports = app;
