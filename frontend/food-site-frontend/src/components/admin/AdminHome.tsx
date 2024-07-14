import axios from "axios";
import useSWR from "swr"

async function fetcher(url:string) {
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
        <h1>hi</h1>
        {data.orders.map((item) => (
            <h2 key={item.id}>{item.id}</h2>
        ))}
    </div>
}