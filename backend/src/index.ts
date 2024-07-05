import express, { Request, Response } from "express";
import cors from "cors";
const app = express();
import router from "./routes";
app.use(cors());
app.use(express.json());
app.get("/" , function(req:Request,res:Response) {
    res.send("Welcome to Our Food Outlet");
})
app.use("/api/v1", router);

app.listen(3000);

export default app; 