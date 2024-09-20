import { SubOrderResult } from "./SubOrderResult";


export class OrderResult{
    products!:SubOrderResult[];
    createdDate !:string;
    receiveDate!:string;
    price!:number;
    orderCode!:string;
    orderId!:number;
}