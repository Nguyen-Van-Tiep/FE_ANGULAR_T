import { UserInfo } from "../info/UserInfo";
import { CartResult } from "../result/CartResult";

export class PaymentInfoResponse {
    products!:CartResult[];
    user!:UserInfo;
    total!:number;
    shippingFee!:number;
    pageNumber!:number;
    pageSize!:number;
    pageFirst!:number;
    pageLast!:number;
    price!:number;
    constructor(){
        this.products = [];
        this.user = new UserInfo();
        this.total = 0;
        this.pageNumber = 0;
        this.pageSize = 0;
        this.pageFirst = 0;
        this.pageLast = 0;
        this.price = 0;
        this.shippingFee = 0;
    }
}