import { User } from "@prisma/client";
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
    const { open_tasks, open_requests } = (await getUser(session.uid)) as User;

    return res.status(200).send({
      open_tasks,
      open_requests,
    });
  }

  res.status(405).send(null);
}

const getUser = async (userId: string) => {
  return prismaClient.user.findFirst({
    where: {
      id: userId,
    },
  });
};
