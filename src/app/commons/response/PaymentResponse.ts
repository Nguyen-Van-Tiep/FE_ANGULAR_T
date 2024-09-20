import { PaymentResult } from "../result/PaymentResult";

export class PaymentResponse{
    code!:string;
    price!:number;
    fee!:number;
    results!:PaymentResult[];
    
}