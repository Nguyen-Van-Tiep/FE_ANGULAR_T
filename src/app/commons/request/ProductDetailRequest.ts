import { ColorResult } from "../result/ColorResult";
import { SizeResult } from "../result/SizeResult";

export class ProductDetailRequest{
    proID !: number
    size !: SizeResult;
    color !: ColorResult;
    status !: number;
}