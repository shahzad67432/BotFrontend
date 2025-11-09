import { NextApiRequest, NextApiResponse } from "next";
import { otpStorage } from "./signup";
import prisma from "@/lib/prisma";
import { create_token } from "@/lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { email, otp } = req.body;

        const otpRecord = otpStorage[email];
        if (otpRecord && otpRecord.otp === otp && otpRecord.expiresAt > new Date()) {
            // Clear OTP after successful verification
            delete otpStorage[email];

            // create user in database
            prisma.user.create({
                data: {
                    email: email,
                },
            }).then((user:any) => {
                console.log("User created:", user);
            }).catch((error:any) => {
                console.error("Error creating user:", error);
            });

            const token = create_token({ email });
            // res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400`);

            res.status(200).json({ message: "OTP verified successfully and User Created", token });
        } else {
            res.status(400).json({ message: "Invalid or expired OTP" });
        }
} else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}