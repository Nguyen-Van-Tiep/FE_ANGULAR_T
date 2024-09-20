import { ImportProductVariantResult } from "../result/ImportProductVariantResult";

export class ImportRequest{
    productId!: Number;
    price!:number;
    cost!:number;
    variants!: ImportProductVariantResult[];
}