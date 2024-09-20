import { PaginationInfo } from "../info/PaginationInfo";
import { ProductDetail } from "../result/ProductDetail";
import { ProductDetailResponse } from "./ProductDetailResponse";

export class ProductDetailsResponse{
    productDetails!:ProductDetailResponse[];
    pagination !:PaginationInfo;
}