import axios from "axios";
import useSWR from "swr"
import { Ordercard } from "./AdminOrderCard";

async function fetcher(url:string){
    const token = localStorage.getItem("token");
    const {data} = await axios.get(url,{
        headers: {
            "authorization": token,
        }
    }
    );
    return data;
}
export default function AdminHome() {
    interface Datainterface  {
        id:number,
        amount :number,
        pending : Boolean,
        timestamp : string,

    }

    interface Allorders {
        orders:Datainterface[],
    }
    const {data,error,isLoading}=useSWR<Allorders>('http://localhost:3000/api/v1/admin/allorders',fetcher);
    if (error) {
        console.log(error);
        return <div>Error</div>
    }
    else if (isLoading) {
        return <div>Loading........</div>
    }

    if (!data) {
        return <div>No Orders</div>
    }
    return <div>
        <table>
            <thead>
            <tr>
                <th>Id</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
            </tr>
            </thead>
            <tbody>
           {data.orders.map((item:Datainterface) => (
            <Ordercard id={item.id} amount={item.amount} pending={item.pending} date={item.timestamp.split("T")[0]}></Ordercard>
        ))}
           </tbody>
        </table>
    </div>
}