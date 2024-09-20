import { OrderResult } from "../result/OrderResult";
import { PaginationInfo } from "../info/PaginationInfo";
export class OrdersResponse extends PaginationInfo{
    username!:string;
    status!:string;
    orders!:OrderResult[];
    billCode!:Number;
    
}