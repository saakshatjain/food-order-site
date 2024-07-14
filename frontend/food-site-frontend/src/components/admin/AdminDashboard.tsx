import Navbar from "./AdminNavbar";
import AdminHome from "./AdminHome";


export default function AdminDashboard() {
    return <div className="grid grid-cols-6">
        <div className="col-span-1"><Navbar></Navbar></div>
        <div className="col-span-5"><AdminHome></AdminHome></div>
    </div>
}