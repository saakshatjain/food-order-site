import express, { Request, Response } from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { adminmiddleware } from "../middlewares/adminmiddleware";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SuiteContext } from "node:test";
const prisma = new PrismaClient();
const router = express.Router();
const signupbody = zod.object({
    firstname : zod.string(),
    lastname : zod.string(),
    username : zod.string().email(),
    password : zod.string(),
    storeId : zod.number(),

})
router.use(express.json());

router.post("/signup" , async function(req:Request,res:Response) {
    const {success} = signupbody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg : "Invalid Inputs"
        })
    }
    
    try {
    const existing = await prisma.admin.findUnique({
        where : {
        username : req.body.username,
        }
    })

    if (existing) {
        return res.status(411).json({
            msg : "Admin already exists"
        })
    }
    const hashed = await bcrypt.hash(req.body.password,5);

    const admin = await prisma.admin.create({
        data : {
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            username : req.body.username,
            password : hashed,
            storeId : req.body.storeId,
        }
    })

    return res.status(200).json({
        msg : "admin created successfully",
    })    

}  catch(error) {
    return res.status(411).json({
        msg : "cant create admin"
    })



}


})

const signinbody = zod.object({
    username : zod.string(),
    password : zod.string(),
})
router.post("/signin", async function(req:Request,res:Response) {
   const {success} = signinbody.safeParse(req.body);

   if (!success) {
    return res.status(411).json({
        msg : "Invalid Inputs"
    })
   }

   try {
    const admin = await prisma.admin.findUnique({
        where : {
            username : req.body.username,
        }
    })

    if (!admin) {
        return res.status(411).json({
            msg : "Admin doesnt exists",
        })
    }

    const match = await bcrypt.compare(req.body.password,admin.password);
    if (!match) {
        return res.status(411).json({
            msg : "Invalid Password"
        })
    }

    const token = jwt.sign({
        storeId : admin.storeId
    },JWT_SECRET); 

    res.json({
        token : token,
    })

} catch(error) {
    res.status(411).json({
        msg : "Login not possible",
    })
}

})

interface CustomRequest extends Request {
    storeId?:Number
}

router.post("/testing" , adminmiddleware , function(req : CustomRequest ,res:Response) {
         res.json({
            msg : "Hello",
        })
})
const itembody = zod.object({
    imageUrl : zod.string(),
    amount : zod.number(),
    discount : zod.number(),
    details : zod.string(),
    visibility : zod.boolean(),
})
router.post("/additem" , adminmiddleware , async function(req:CustomRequest,res:Response) {  
       const {success} = itembody.safeParse(req.body);
       if (!success) {
        return res.status(400).json({
            msg : "Invalid Paramters",
        })
       }
       const storeId:number = req.storeId as number;
       console.log(storeId);
       try {
        const result = await prisma.menu.create({
            data : {
                storeId:storeId,
                imageUrl:req.body.imageUrl,
                amount:req.body.amount,
                discount:req.body.discount,
                visibility:req.body.visibility,
                details: req.body.details,
            }
        })

        return res.status(200).json({
            msg : "Item added"
        })
       } catch(error) {
        console.log(error);
        return res.status(400).json({
            msg : "Item couldnt be added",
        })
       }
})
export default router;