"use server";

import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;

export const gmailConnectionExpiryRequest = async (token: string) => {
  try {
    // Verify token integrity
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const email = decoded.email;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("User not found");

    // Find OAuth record for this user
    const response = await prisma.userOAuth.findUnique({
      where: { userId: user.id },
      select: { expiry: true },
    });
    if (!response) throw new Error("OAuth record not found");

    return response.expiry;
  } catch (error: any) {
    console.error("Error verifying Gmail connection:", error);
    throw new Error("Invalid or expired session");
  }
};


export const getUserMessages = async (token: string, page: number) => {
  try {
    // Verify token integrity
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const email = decoded.email;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (!user) throw new Error("User not found");

    const Messages_Per_Page = 20;

    const messages = await prisma.messages.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * Messages_Per_Page,
      take: Messages_Per_Page,
    });


    return messages.reverse();
  } catch (error: any) {
    console.error("Error retrieving user messages:", error);
    throw new Error("Invalid or expired session");
  }
};