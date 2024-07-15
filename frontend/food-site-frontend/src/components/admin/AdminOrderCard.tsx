interface Datainterface  {
    id:number,
    amount :number,
    pending : Boolean,
    date : string,

}

export function Ordercard({id, amount, pending,date}:Datainterface) {
    return <tr>
        <td>{id}</td>
        <td>{amount}</td>
        <td>{pending ? "Pending" : "Completed"}</td>
        <td>{date}</td>
    </tr>
}