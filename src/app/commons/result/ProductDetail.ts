import { ColorResult } from './ColorResult';
import { Image } from './Image';
import { ImageResult } from './ImageResult';
import { SizeResult } from './SizeResult';

export class ProductDetail {
  id!: number;
  size!: SizeResult;
  color!: ColorResult;
  quantity!: number;
  price!: number;
  description!: string;
  status!: number;
  images!: Image[];
}
