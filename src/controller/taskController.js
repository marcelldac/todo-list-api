const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//#region Create Task
/* The `exports.create` function is responsible for creating a new task in the database. It receives a
request object (`req`) and a response object (`res`) as parameters. */
exports.create = async (req, res) => {
  const { name } = req.body;

  const taskAlreadyExists = await prisma.task.findUnique({
    where: {
      name,
    },
  });

  if (!taskAlreadyExists) {
    const task = await prisma.task.create({
      data: {
        name,
      },
    });
    return res.status(201).json(task);
  }

  return res.status(500).json({ error: "Task already exists" });
};

//#endregion

//#region Read Tasks
/* The `exports.read` function is responsible for retrieving all tasks from the database. It uses the
`prisma.task.findMany()` method to fetch all tasks. If no tasks are found, it returns a 404 status
code with an error message. If tasks are found, it returns a 200 status code with the tasks in JSON
format. */
exports.read = async (req, res) => {
  const tasks = await prisma.task.findMany();

  if (!tasks) {
    return res.status(404).json({ error: "Tasks not found" });
  }

  return res.status(200).json(tasks);
};

//#endregion

//#region Update Todo
/* The `exports.update` function is responsible for updating a task in the database. */
exports.update = async (req, res) => {
  const { id } = req.params;
  const { name, isCompleted } = req.body;

  const intID = parseInt(id);

  const taskAlreadyExists = await prisma.task.findUnique({
    where: { id: intID },
  });

  if (!taskAlreadyExists) {
    return res.status(404).json({ message: "Task does not exists" });
  }

  const task = await prisma.task.update({
    where: {
      id: intID,
    },
    data: {
      name,
      isCompleted,
    },
  });

  return res.status(200).json(task);
};

//#endregion

//#region Delete Todo
/* The `exports.delete` function is responsible for deleting a task from the database. */
exports.delete = async (req, res) => {
  const { id } = req.params;

  const intID = parseInt(id);

  const taskAlreadyExist = await prisma.task.findUnique({
    where: { id: intID },
  });

  if (!taskAlreadyExist) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({ where: { id: intID } });

  return res
    .status(200)
    .json({ message: `Task with id '${intID}' was deleted successfully` });
};

//#endregion

//#region Delete Task By Name
/* The `exports.deleteByName` function is responsible for deleting a task from the database based on
its name. It receives a request object (`req`) and a response object (`res`) as parameters. */
exports.deleteByName = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Task name is required" });
  }

  const taskExists = await prisma.task.findUnique({
    where: {
      name,
    },
  });

  if (!taskExists) {
    return res
      .status(400)
      .json({ error: "Task with this name does not exist" });
  }

  await prisma.task.delete({
    where: {
      name,
    },
  });

  return res.sendStatus(204);
};

//#endregion
