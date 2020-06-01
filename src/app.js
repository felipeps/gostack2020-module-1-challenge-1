const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;

  if (isUuid(id)) {
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex != -1) {
      request.repositoryIndex = repositoryIndex;
      return next();
    }
  }

  return response.status(400).json({ error: "Repository not found"});
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repository = { id: uuid(), title: title, url: url, techs: techs, likes: 0 };
  
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories[request.repositoryIndex];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete("/repositories/:id", validateId, (request, response) => {
  const { id } = request.params;

  repositories.splice(request.repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateId, (request, response) => {
  const { id } = request.params;

  const repository = repositories[request.repositoryIndex];

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
