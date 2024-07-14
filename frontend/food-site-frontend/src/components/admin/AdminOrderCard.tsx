interface Datainterface  {
    id:number,
    amount :number,
    pending : Boolean,

}

export function Ordercard({id, amount, pending}:Datainterface) {
    return <div className="flex justify-between">
        <div>{id}</div>
        <div>{amount}</div>
        <p>Status: {pending ? "Pending" : "Completed"}</p>
    </div>
}