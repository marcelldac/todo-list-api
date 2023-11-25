import fastify from "fastify";

import {
  createTask,
  readTask,
  updateTask,
  deleteTask,
  deleteTaskByName,
} from "./controller/taskController";

const app = fastify();

app.get("/tasks", createTask);
app.get("/tasks", readTask);
app.get("/tasks/:id", updateTask);
app.get("/tasks/:id", deleteTask);

app.get("/helper", deleteTaskByName);

app
  .listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("HTTP Server Running");
  });
