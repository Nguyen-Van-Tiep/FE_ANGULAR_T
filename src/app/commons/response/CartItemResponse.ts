import { ShowProductDetail } from "./ShowProductDetail";

export class CartItemResponse{
    id !: number;
    productDetail !: ShowProductDetail;
    quantity !: number;
}