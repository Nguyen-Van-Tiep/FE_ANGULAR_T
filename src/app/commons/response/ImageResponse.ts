import { ProductDetailResponse } from "./ProductDetailResponse";

export class ImageResponse {
    id !: number;
    productDetails !: ProductDetailResponse
    url !: string
}