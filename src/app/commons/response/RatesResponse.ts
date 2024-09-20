import { RateResult } from "../result/RateResult";

export class RatesResponse{
    rates!:RateResult[];
    pageSize!:Number;
    pageNumber!:Number;
    total!:Number;
    isLast!:Boolean;
    productCode!:String;
}