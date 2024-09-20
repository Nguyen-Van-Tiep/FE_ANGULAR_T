import { ImportProductVariantResult } from "../result/ImportProductVariantResult";

export class EditProductRequest {
    imgId!: number;
    image!: string;
    status!:string;
    brandId!:number;
    styleId!:number;
    type!:string;
    gender!:string;
    name!:string;
    description!:String;
    variants!: ImportProductVariantResult[];
    cost!:number;
    price!:number;
    imgs!:Number[];
    sku!:string;
}