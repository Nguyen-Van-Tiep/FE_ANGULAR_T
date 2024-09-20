import { PaginationInfo } from "../info/PaginationInfo";
import { ShowProductResponse } from "./ShowProductResponse";

export class ShowProductsResponse{
    products!:ShowProductResponse[];
    pagination !:PaginationInfo;
}