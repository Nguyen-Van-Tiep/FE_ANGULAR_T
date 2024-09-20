import { ColorResult } from "../result/ColorResult";
import { SizeResult } from "../result/SizeResult";

export class ProductDetailResponse {
    id !: number;
    size !: SizeResult;
    color !: ColorResult;
    quantity !: string;
    price !: string;
    description !: string;
    status !: number;
}