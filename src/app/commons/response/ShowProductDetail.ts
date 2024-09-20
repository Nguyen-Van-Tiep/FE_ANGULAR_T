import { ColorResult } from '../result/ColorResult';
import { SizeResult } from '../result/SizeResult';
import { ShowImage } from './ShowImage';

export class ShowProductDetail {
  id!: number;
  size!: SizeResult;
  color!: ColorResult;
  quantity!: number;
  price!: number;
  description!: string;
  status!: number;
  imageList!: ShowImage[];
  productName!: string; // Thêm thuộc tính này nếu cần
  brand!: string; // Thêm thuộc tính này nếu cần
}
