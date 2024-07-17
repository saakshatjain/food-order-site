import { PropsWithChildren } from "react"
import { Sidebar } from "./SideBar"
export const AdminDashboard=({children}:PropsWithChildren)=>{
    return (
        <div className="grid grid-cols-6 w-screen h-screen ">
            <div className="col-span-1 ">
                <Sidebar></Sidebar>
            </div>
            <div className="col-span-5 ">
                {children}
           </div>
        </div>
    )
}