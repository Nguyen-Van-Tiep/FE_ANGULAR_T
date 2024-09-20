import { PaymentResult } from "../result/PaymentResult";

export class PaymentRequest {
    code!: string;
    paymentMethod!: string;
    addressCode!: number;
    results!: PaymentResult[];
    type!: string;
    cartIds !: number[];
}