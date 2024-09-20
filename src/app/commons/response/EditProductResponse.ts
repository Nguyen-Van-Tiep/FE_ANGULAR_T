import { BaseResult } from "../result/BaseResult";
import { ImageResult } from "../result/ImageResult";
import { ImportProductVariantResult } from "../result/ImportProductVariantResult";
import { CategoryResponse } from "./CategoryResponse";

export class EditProductResponse {
    imgId!: number;
    img!: string;
    status!:BaseResult;
    brand!:CategoryResponse;
    style!:CategoryResponse | null;
    type!:string;
    gender!:string;
    name!:string;
    description!:string;
    variants!: ImportProductVariantResult[];
    totalQuantity!:number;
    totalVariant!:number;
    cost!:number;
    price!:number;
    imageResults!:ImageResult[];

    constructor(){
        this.brand = new CategoryResponse();
        this.status = new BaseResult();
    }
}