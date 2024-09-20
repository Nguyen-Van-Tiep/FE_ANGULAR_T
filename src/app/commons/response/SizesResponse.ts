import { PaginationInfo } from "../info/PaginationInfo";
import { SizeResponse } from "./SizeResponse";

export class SizesResponse {
    sizes!: SizeResponse[];
    pagination!: PaginationInfo;
}