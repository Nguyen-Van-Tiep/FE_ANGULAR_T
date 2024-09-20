import { PaginationInfo } from "../info/PaginationInfo";
import { ColorResponse } from "./ColorResponse";

export class ColorsResponse {
    colors!: ColorResponse[];
    pagination!: PaginationInfo;
}