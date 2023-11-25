import fastify from "fastify";

import {
  createTask,
  readTask,
  updateTask,
  deleteTask,
  deleteTaskByName,
} from "./controller/taskController";

const app = fastify({ logger: true });

app.post("/tasks", createTask);
app.get("/tasks", readTask);
app.put("/tasks/:id", updateTask);
app.delete("/tasks/:id", deleteTask);

app.delete("/helper", deleteTaskByName);

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: process.env.PORT ? Number(process.env.PORT) : 3333,
    });
    console.log("HTTP Server Running");
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

start();
