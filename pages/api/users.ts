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
    const users = await getSystemUsers(session.uid);
    res.status(200).send(users);
  }

  res.status(405).send(null);
}

const getSystemUsers = async (userId: string) => {
  return prismaClient.user.findMany({
    orderBy: {
      name: "desc",
    },
  });
};
