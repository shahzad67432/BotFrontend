
"use server";

import jwt from "jsonwebtoken";
import { db } from "@/lib/neo4j";

const JWT_SECRET = process.env.JWT_SECRET!;

export const gmailConnectionExpiryRequest = async (token: string) => {
  try {
    // Verify token integrity
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const email = decoded.email;

    // Find user by email
    const user = await db.findUserByEmail(email);
    if (!user) throw new Error("User not found");

    // Find OAuth record for this user
    console.log("fetching the oauth expiry", user.id);
    const response = await db.getUserOAuth(user.id);
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
    console.log("again fetching the messages");
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    const email = decoded.email;
    
    // Find user by email
    const user = await db.findUserByEmail(email);
    console.log("User found:", user);
    if (!user) throw new Error("User not found");

    const messages = await db.getUserMessages(user.id, page, 20);

    return messages;
  } catch (error: any) {
    console.error("Error retrieving user messages:", error);
    throw new Error("Invalid or expired session");
  }
};

