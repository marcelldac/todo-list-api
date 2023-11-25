import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const prisma = new PrismaClient();

//#region Create Task

export const createTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const createUserSchema = z.object({
    name: z.string(),
  });

  try {
    const { name } = createUserSchema.parse(request.body);

    const taskAlreadyExists = await prisma.task.findUnique({
      where: {
        name,
      },
    });

    if (!taskAlreadyExists) {
      await prisma.task.create({
        data: {
          name,
        },
      });
      return reply.status(200).send();
    }

    return reply
      .code(500)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ error: "Task already exists" });
  } catch (e) {
    console.log(e);
  }
};

//#endregion

//#region Read Tasks

export const readTask = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const tasks = await prisma.task.findMany();

  if (!tasks) {
    return reply
      .code(404)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ error: "Tasks not found" });
  }

  return { tasks };
};

//#endregion

//#region Update Todo

export const updateTask = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  const createUserSchema = z.object({
    name: z.string(),
    isCompleted: z.boolean(),
  });

  const { name, isCompleted } = createUserSchema.parse(request.body);
  const intID = parseInt(id);

  const taskAlreadyExists = await prisma.task.findUnique({
    where: { id: intID },
  });

  if (!taskAlreadyExists) {
    return reply
      .code(404)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ error: "Task does not exists" });
  }

  await prisma.task.update({
    where: {
      id: intID,
    },
    data: {
      name,
      isCompleted,
    },
  });

  return reply.status(200).send();
};

//#endregion

//#region Delete Task

export const deleteTask = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = req.params;
  const intID = parseInt(id);

  try {
    const taskAlreadyExist = await prisma.task.findUnique({
      where: { id: intID },
    });

    if (!taskAlreadyExist) {
      return reply
        .code(404)
        .header("Content-Type", "application/json; charset=utf-8")
        .send({ error: "Task not found" });
    }

    await prisma.task.delete({ where: { id: intID } });

    return reply.status(200).send();
  } catch (e) {
    console.log(e);
    return reply
      .code(404)
      .header("Content-Type", "application/json; charset=utf-8")
      .send({ error: e });
  }
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
