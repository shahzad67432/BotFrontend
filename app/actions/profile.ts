"use server";
import { prisma } from "@/lib/prisma"; // adjust your prisma client path
import jwt from "jsonwebtoken";

const SECRET_KEY = "secretkey123"; // use your actual secret

export async function getUserProfileData(token: string) {
  try {
    // Decode JWT to get email
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
    const userEmail = decoded.email;

    // Fetch user with email history
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        name: true,
        email: true,
        credits: true,
        emailHistory: {
          orderBy: { sentAt: "desc" },
          take: 50, // limit to last 50 emails
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      name: user.name || "User",
      email: user.email,
      credits: user.credits,
      emailHistory: user.emailHistory.map((email) => ({
        id: email.id,
        receiverEmail: email.receiverEmail,
        receiverName: email.receiverName,
        emailType: email.emailType,
        sentAt: email.sentAt,
        status: email.status,
      })),
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
}