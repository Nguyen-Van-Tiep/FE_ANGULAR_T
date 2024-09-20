import { CartResult } from "../result/CartResult";

export class CartResposnse{
    products!:CartResult[];
    total!:number;
    pageNumber!:number;
    pageSize!:number;
    pageFirst!:number;
    pageLast!:number;
}