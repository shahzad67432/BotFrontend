import { NextApiRequest, NextApiResponse } from "next";
import { otpStorage } from "./signup";
import prisma from "@/lib/prisma";
import { create_token } from "@/lib/jwt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email, otp, SignType } = req.body;

    const otpRecord = otpStorage[email];
    if (!otpRecord || otpRecord.otp !== otp || otpRecord.expiresAt <= new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP after successful verification
    delete otpStorage[email];

    try {
        if (SignType === "signup") {
            const user = await prisma.user.create({
                data: { email },
            });

            const token = create_token({ email, userId: user.id });
            return res.status(200).json({ message: "OTP verified successfully and User Created", token });

        } else if (SignType === "login") {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const token = create_token({ email, userId: user.id });
            return res.status(200).json({ message: "OTP verified successfully", token });
        } else {
            return res.status(400).json({ message: "Invalid SignType" });
        }
    } catch (err) {
        console.error("Error handling OTP verification:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}