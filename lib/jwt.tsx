import jwt from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET as string;

export function create_token(payload: object): string {
    return jwt.sign(payload, secret, { expiresIn: "100h" });
}

export function verify_token(token: string): object | string {
    try{
        return jwt.verify(token, secret)
    }catch(err){
        return "Invalid Token"
    }
}