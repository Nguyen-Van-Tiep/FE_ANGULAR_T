import { PaginationInfo } from "../info/PaginationInfo";
import { BrandResult } from "../result/BrandResult";
import { BrandResponse } from "./BrandResponse";

export class BrandsResponse {
    brands!: BrandResponse[];
    pagination!: PaginationInfo;
}