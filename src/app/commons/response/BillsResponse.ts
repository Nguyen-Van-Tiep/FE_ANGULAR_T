import { PaginationInfo } from "../info/PaginationInfo";
import { BillResult } from "../result/BillResult";

export class BillsResponse {
    bills!: BillResult[];
    pagination!: PaginationInfo;
}