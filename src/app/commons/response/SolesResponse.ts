import { PaginationInfo } from "../info/PaginationInfo";
import { SoleResponse } from "./SoleResponse";

export class SolesResponse {
    soles!: SoleResponse[];
    pagination!: PaginationInfo;
}