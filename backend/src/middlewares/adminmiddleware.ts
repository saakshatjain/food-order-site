import { JWT_SECRET } from "../config1";
import { NextFunction, Request,Response } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    storeId?:Number
}

const adminmiddleware = async function(req:CustomRequest,res:Response,next:NextFunction) {
    const token:string|undefined = req.headers.authorization;
    if (!token) {
        return res.status(411).json({
            msg : "Invalid authorization"
        })
    }

    try {
        const verify = jwt.verify(token,JWT_SECRET) as {storeId : number};
        req.storeId = verify.storeId;
        console.log(verify);
        next();
    } catch(error) {
        return res.status(411).json({});
    }
}

export {
    adminmiddleware
}