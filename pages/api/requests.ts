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
    const tasks = await getUserRequests(session.uid);
    return res.status(200).send(tasks);
  }

  if (req.method === "POST") {
    const body = req.body as CreateRequestDTO;

    const task = await createRequest({
      userId: session.uid,
      assignedToUserId: body.assignedToUserId,
      title: body.title,
      description: body.description,
      importance: body.importance,
      ticket: body.ticket,
    });

    return res.status(201).send(task);
  }

  res.status(405).send(null);
}

const getUserRequests = async (userId: string) => {
  return prismaClient.task.findMany({
    where: {
      assigned_by_user: userId,
      complete: false,
      self_assigned: false,
    },
    orderBy: {
      importance: "desc",
    },
  });
};

interface CreateRequestDTO {
  userId: string;
  assignedToUserId: string;
  title: string;
  importance: number;
  description?: string;
  ticket?: string;
}

const createRequest = async (data: CreateRequestDTO) => {
  await prismaClient.task.create({
    data: {
      assigned_by_user: data.userId,
      assigned_to_user: data.assignedToUserId,
      title: data.title,
      importance: data.importance,
      description: data.description,
      ticket: data.ticket,
      self_assigned: false,
    },
  });

  await incrementUserOpenRequests(data.userId);
  await incrementUserOpenTasks(data.assignedToUserId);
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

const incrementUserOpenRequests = async (userId: string) => {
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
      open_requests: currentOpenRequests + 1,
    },
  });
};

const decimalToNumber = (decimal: Decimal) => {
  return parseInt(decimal.toString());
};
