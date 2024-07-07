import express, { Request, Response } from "express";
const zod = require("zod");
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';
import { userInfo } from "os";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../config";
import { authmiddleware } from "../middlewares/authmiddleware";

const signupBody = zod.object({
    username: zod.string().email(),
	firstname: zod.string(),
	lastname: zod.string(),
	password: zod.string().min(5),
    contact : zod.number(),
    addresses : zod.object({
    houseno : zod.string(),
    city : zod.string(),
    pincode : zod.number(),
    }),
})

const signinbody = zod.object({
    username : zod.string().email(),
    password : zod.string(),
})
router.use(express.json());

router.post("/signup" , async function(req:Request,res:Response) {
    const {success} = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg : "Invalid Inputs"
        })
    }
    try {
    const alreadyexist = await prisma.user.findUnique({
        where : {
            username:req.body.username
        }
    })

    if (alreadyexist) {
        return res.status(411).json({
            msg : "User already exists"
        })
    }

    const hashed = await bcrypt.hash(req.body.password,5);

    const user = await prisma.user.create({
        data : {
            username :req.body.username,
            firstname :req.body.firstname,
            lastname :req.body.lastname,
            contact :req.body.contact,
            password :hashed,
            addresses : {
                create : {
                    houseno : req.body.addresses.houseno,
                    city : req.body.addresses.city,
                    pincode : req.body.addresses.pincode,
                }

            }


        }
    })
    console.log(user);
    
    return res.status(200).json({
        msg : "User created Successfully",
    })



} catch(error) {
    console.log(error);
    return res.status(411).json({
        msg : "User cant be created",
    })
}



})

router.post("/signin",  async function(req:Request,res:Response) {
    const {success} = signinbody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            msg : "Invalid Inputs"
        })
    }

    try {
        const user = await prisma.user.findUnique({
            where : {
            username : req.body.username,
            }
        })

        if (!user) {
            return res.status(411).json({
                msg : "User doesnt exists"
            })
        }

        const match = await bcrypt.compare(req.body.password,user.password);
        if (!match) {
            return res.status(411).json({
                msg : "Invalid Password"
            })
        }

        const token = jwt.sign({
            username : user.username
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
const addressbody = zod.object({
    houseno : zod.string(),
    city : zod.string(),
    pincode : zod.number(),
})

router.post("/testing" , authmiddleware , function(req : Request ,res:Response) {
    res.json({
       msg : "Hello",
   })
})

interface CustomRequest extends Request {
    username?:String
}

router.post("/addaddress", authmiddleware , async function(req:CustomRequest,res:Response) {
    const {success} = addressbody.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            msg : "Invalid Inputs",
        })
    }
    let username:string = req.username as string;
    try {
    const result = await prisma.address.create({
        data: {
            username ,
            houseno: req.body.houseno,
            city: req.body.city,
            pincode: req.body.pincode,
        },
    })

    return res.status(200).json({
        msg : "address added succesfully",
    })
} catch(error) {
    console.error(error);
    return res.status(411).json({
        id : req.username,
        msg : "Address could'nt be added"
    })
}
})

router.get("/getaddress", authmiddleware, async function(req : CustomRequest, res:Response) {
      let username:string = req.username as string;
      try {
        const result = await prisma.address.findMany({
            where : {
                username,
            }
        })

        return res.status(200).json({
            addresses : result
        })
      } catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch addresses"
        })
      } 
})

router.put("/editaddress", authmiddleware , async function(req:CustomRequest,res:Response) {
    try {
        const result = await prisma.address.update({
            where : {
                id : req.body.id as number,
            },
            data : {
                houseno : req.body.houseno,
                city : req.body.city,
                pincode : req.body.pincode,
            }
        })
        return res.status(200).json({
            msg : "Address updated succesfully",
        })
     } catch(error) {
            return res.status(411).json({
                msg : "Couldnt update address",
            })
        }
})

router.get("/menu", authmiddleware , async function(req:CustomRequest,res:Response) {
    const storeid = parseInt(req.query.storeid as string);
    try { 
       const items = await prisma.menu.findMany({
        where : {
            storeId : storeid,
            visibility : true,
        }
       })

       return res.status(200).json({
          menu : items,
       })
    } catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch menu"
        })
    }
})

export default router;