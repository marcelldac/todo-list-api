const express = require("express");
const cors = require("cors");

const taskRouter = require("./router/taskRouter");
const helperRouter = require("./router/helperRouter");

const app = express();

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());

app.use("/tasks", taskRouter);
app.use("/helper", helperRouter);

app.listen(PORT, () => {
  console.log(`Running on ${HOST}:${PORT}`);
});
