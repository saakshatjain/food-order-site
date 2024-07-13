import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./AdminNavbar";
import AdminHome from "./AdminHome";


export default function AdminDashboard() {
    return <div>
     <Navbar></Navbar>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<AdminHome></AdminHome>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
}