import { PaginationInfo } from "../info/PaginationInfo";
import { CartResult } from "../result/CartResult";

export class CartsResponse{
    carts!: CartResult[];
    cartId!: number;
    username!: string;
    total!: number;
    quantity!: number;
    totalMoney!: number;
    pagination!:PaginationInfo;
}