import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

//#region Create Task

export const createTask = async (req: Request, res: Response) => {
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

export const readTask = async (res: Response) => {
  const tasks = await prisma.task.findMany();

  if (!tasks) {
    return res.status(404).json({ error: "Tasks not found" });
  }

  return res.status(200).json(tasks);
};

//#endregion

//#region Update Todo

export const updateTask = async (req: Request, res: Response) => {
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

//#region Delete Task

export const deleteTask = async (req: Request, res: Response) => {
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

export const deleteTaskByName = async (req: Request, res: Response) => {
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
