import { PaginationInfo } from "../info/PaginationInfo";
import { GetProductResult } from "../result/GetProductResult";

export class GetProductsResponse {
    products!: GetProductResult[];
    pagination!: PaginationInfo;
}