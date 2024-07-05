import { JWT_SECRET } from "../config";
import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    username?:String
}

const authmiddleware = async function(req:CustomRequest,res:Response,next:NextFunction) {
    const token:string|undefined = req.headers.authorization;
    if (!token) {
        return res.status(411).json({
            msg : "Invalid authorization"
        })
    }

    try {
        const verify = jwt.verify(token,JWT_SECRET) as {username : string};
        req.username = verify.username;
        console.log(verify);
        next();
    } catch(error) {
        return res.status(411).json({});
    }
}

export {
    authmiddleware,
}