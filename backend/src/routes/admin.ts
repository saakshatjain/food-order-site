import express, { Request, Response } from "express";
import zod from "zod";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config1";
import { adminmiddleware } from "../middlewares/adminmiddleware";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SuiteContext } from "node:test";
import { disconnect } from "node:process";
import { timeStamp } from "node:console";
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
    const parsed = signupbody.safeParse(req.body);
    if (!parsed.success) {
        console.log(parsed.error.message);
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

router.get("/items", adminmiddleware , async function(req:CustomRequest,res:Response) {
    try {
        const result = await prisma.menu.findMany({
            where : {
                storeId : req.storeId as number,
            }
        })

        return res.status(200).json({
            items : result,
        })
    } catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch items",
        })
    }

})

router.put("/changevisibility", adminmiddleware , async function(req:CustomRequest,res:Response) {
     try {
        const item = await prisma.menu.findUnique({
            where : {
                id:req.body.id,
            }
        })

        if (!item) {
            return res.status(404).json({
                msg: "Item not found",
            });
        }
        const visibility:boolean = item.visibility as boolean;
        const update = await prisma.menu.update({
            where : {
                id : req.body.id,
            },
            data : {
                visibility : !visibility,
            }
        })
        
        return res.status(200).json({
            msg : "Visibility changed",
        })
        } catch(error) {
            return res.status(400).json({
                msg : "couldnt change visibilty",
            })
     }
})

router.get("/allorders" , adminmiddleware , async function(req:CustomRequest,res:Response) {
    try {
        const result = await prisma.order.findMany({
            where : {
                storeId:req.storeId as number,
            }
        })

        return res.status(200).json({
            orders : result,
        })
    } catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch orders",
        })
    }
})

router.get("/pendingorder" , adminmiddleware , async function(req:CustomRequest,res:Response) {
    try {
        const result = await prisma.order.findMany({
            where : {
                storeId:req.storeId as number,
                pending:false,
            }
        })
        return res.status(200).json({
            orders : result,
        })
    }
    catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch orders",
        })
    }
})

const completed = zod.object({
    id : zod.number(),
})
router.post("/completed" , adminmiddleware , async function(req:CustomRequest,res:Response) {

    const {success} = completed.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg : "Invalid paramters",
        })
    }
    try {
        const result = await prisma.order.update({
            where : {
                id : req.body.id as number,
            },
            data : {
                pending:true,
            }
        })
        return res.status(200).json({
            msg : "Order completed successfuly",
        })
    } catch(error) {
        return res.status(400).json({
            msg : "Couldnt complete order currently",
        })
    } 
})

const updateitem = zod.object({
    id : zod.number(),
    amount : zod.number(),
    discount : zod.number(),
})
router.put("/updateitem", adminmiddleware , async function(req:CustomRequest,res:Response) {

    const {success} = updateitem.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            msg : "Invalid paramters",
        })
    }
    try {
        const result = await prisma.menu.update({
            where : {
                id : req.body.id,
            },
            data : {
                amount : req.body.amount,
                discount : req.body.discount,
            }
        })

        return res.json({
            msg : "Item updated successfully",
        })
    } catch(error) {
        console.log(error);
        return res.status(400).json({
            msg : "Couldnt update item",
        })
    }
})

router.get("/getmonthsales", adminmiddleware, async function(req:CustomRequest,res:Response) {
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth(); 
    let currentDay=dateobj.getDate();

    try {
        const total = await prisma.order.aggregate({
            where: {
                AND: [
                  {
                    timestamp: {
                      gte: new Date(currentYear, currentMonth-1, currentDay+1), 
                    },
                  },
                  {
                    timestamp: {
                      lt: new Date(currentYear, currentMonth, currentDay+1), 
                    },
                  },
                ],
              },
              _sum:{
                  amount:true
              }
          });
          if (total["_sum"]["amount"]==null) {
            total["_sum"]["amount"]=0;
        }

          return res.json({"total":total["_sum"]["amount"]});
    } catch(error) {
        return res.status(400).json({
            msg : "Couldnt fetch Amount",
        })
    }
})

router.get("/dailysales", adminmiddleware , async function(req:CustomRequest,res:Response) {
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth();
    let currentDay=dateobj.getDate();
    try{
        const total = await prisma.order.aggregate({
            where: {
              AND: [
                {
                  timestamp: {
                    gte: new Date(currentYear, currentMonth, currentDay), 
                  },
                },
                {
                  timestamp: {
                    lt: new Date(currentYear, currentMonth, currentDay+1), 
                  },
                },
              ],
            },
            _sum:{
                amount:true
            }
        });
        if (total["_sum"]["amount"]==null) {
            total["_sum"]["amount"]=0;
        }
        res.json({"total":total["_sum"]["amount"]});

    }catch(err){
        res.status(500).json({"msg":"Couldnt fetch amount"});
    }
})
export default router;