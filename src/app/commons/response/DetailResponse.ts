import { Image } from '../result/Image';
import { ImageResponse } from './ImageResponse';
import { ProductDetailResponse } from './ProductDetailResponse';

export class DetailResponse {
  productDetail!: ProductDetailResponse;
  images!: ImageResponse[];
}
