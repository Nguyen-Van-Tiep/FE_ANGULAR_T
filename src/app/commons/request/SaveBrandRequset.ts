import { CategoryResult } from "../result/CategoryResult";

export class SaveBrandRequest {
    id!: number;
    name!: string;
    country!: string;
    description!: string;
    status!: string;
    imgId!: number;
    styles!: CategoryResult[];
    date!: string;
}