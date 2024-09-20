import { PaginationInfo } from "../info/PaginationInfo";
import { MaterialResponse } from "./MaterialResponse";

export class MaterialsResponse {
    materials!: MaterialResponse[];
    pagination!: PaginationInfo;
}