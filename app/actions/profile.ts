
"use server";
import { db } from "@/lib/neo4j";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secretkey123";

export async function getUserProfileData(token: string) {
  try {
    // Decode JWT to get email
    const decoded = jwt.verify(token, SECRET_KEY) as { email: string };
    const userEmail = decoded.email;

    // Fetch user with email history
    const userData = await db.getUserProfileData(userEmail);

    if (!userData) {
      throw new Error("User not found");
    }

    return userData;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
}
