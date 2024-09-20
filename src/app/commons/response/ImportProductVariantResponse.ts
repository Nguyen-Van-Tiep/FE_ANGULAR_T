import { ImportProductVariantResult } from "../result/ImportProductVariantResult";

export class ImportProductVariantResponse{
    productDetailId!: number;
    variants!: ImportProductVariantResult[];
}