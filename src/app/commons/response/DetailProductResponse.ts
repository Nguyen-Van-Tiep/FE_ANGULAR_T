import { ImportProductVariantResult } from "../result/ImportProductVariantResult";
import { BaseResult } from "../result/BaseResult";
import { ImageInfo } from "../info/ImageInfo";

export class DetailProductResponse{
    code!:String;
    id!: Number;
    name!:String;
    price:Number;
    gender!:string;
    variants:ImportProductVariantResult[];
    type!:String;
    description!:String;
    style!:String;
    brand!:String;
    status:BaseResult;
    primaryImage:ImageInfo;
    subImages:ImageInfo[];
    totalVariant!:Number;
    totalQuantity!:Number;

    constructor(){
        this.variants = [];
        this.status = new BaseResult();
        this.primaryImage = new ImageInfo();
        this.subImages = [];
        this.price = 0;
    }
}