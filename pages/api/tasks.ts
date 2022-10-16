import { Decimal } from "@prisma/client/runtime";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prismaClient from "../../utils/prisma-client";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await unstable_getServerSession(
    req,
    res,
    authOptions
  )) as any;

  if (req.method === "GET") {
    const task_id = req.query.task;

    if (task_id !== undefined) {
      const task = await getTask(task_id as string);
      return res.status(200).send(task);
    }

    const tasks = await getUserTasks(session.uid);
    return res.status(200).send(tasks);
  }

  if (req.method === "POST") {
    const body = req.body as CreateTaskDTO;

    const task = await createTask({
      userId: session.uid,
      title: body.title,
      description: body.description,
      importance: body.importance,
      ticket: body.ticket,
    });

    return res.status(201).send(task);
  }

  if (req.method === "PUT") {
    const task_id = req.query.task;
    await setTaskComplete(task_id as string, session.uid);
    return res.status(200).send({});
  }

  res.status(405).send(null);
}

const setTaskComplete = async (taskId: string, userId: string) => {
  const task = await prismaClient.task.findFirst({
    where: {
      id: taskId,
    },
  });

  await prismaClient.task.update({
    where: {
      id: taskId,
    },
    data: {
      complete: true,
      completed_at: new Date(),
    },
  });

  await decrementUserOpenTasks(task!.assigned_to_user);

  if (!task?.self_assigned) {
    await decrementUserOpenRequests(task!.assigned_by_user);
  }
};

const getTask = async (taskId: string) => {
  return prismaClient.task.findFirst({
    where: {
      id: taskId,
    },
  });
};

const getUserTasks = async (userId: string) => {
  return prismaClient.task.findMany({
    where: {
      assigned_to_user: userId,
      complete: false,
    },
    orderBy: {
      importance: "desc",
    },
  });
};

interface CreateTaskDTO {
  userId: string;
  title: string;
  importance: number;
  description?: string;
  ticket?: string;
}

const createTask = async (data: CreateTaskDTO) => {
  const task = prismaClient.task.create({
    data: {
      assigned_by_user: data.userId,
      assigned_to_user: data.userId,
      title: data.title,
      importance: data.importance,
      description: data.description,
      ticket: data.ticket,
      self_assigned: true,
    },
  });

  await incrementUserOpenTasks(data.userId);

  return task;
};

const incrementUserOpenTasks = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  const currentOpenTasks = decimalToNumber(user?.open_tasks!);

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      open_tasks: currentOpenTasks + 1,
    },
  });
};

const decrementUserOpenTasks = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  const currentOpenTasks = decimalToNumber(user?.open_tasks!);

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      open_tasks: currentOpenTasks - 1,
    },
  });
};

const decrementUserOpenRequests = async (userId: string) => {
  const user = await prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });

  const currentOpenRequests = decimalToNumber(user?.open_requests!);

  await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      open_requests: currentOpenRequests - 1,
    },
  });
};

const decimalToNumber = (decimal: Decimal) => {
  return parseInt(decimal.toString());
};
