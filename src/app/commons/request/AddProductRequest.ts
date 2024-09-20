import { BrandResponse } from '../response/BrandResponse';
import { MaterialResponse } from '../response/MaterialResponse';
import { SoleResponse } from '../response/SoleResponse';
import { StyleResponse } from '../response/StyleResponse';
import { ProductDetail } from '../result/ProductDetail';

export class AddProductRequest {
  id!: number;
  productName!: string;
  brand?: BrandResponse | null; // brand có thể là null hoặc không xác định
  style?: StyleResponse | null; // style có thể là null hoặc không xác định
  material?: MaterialResponse | null; // material có thể là null hoặc không xác định
  sole?: SoleResponse | null; // sole có thể là null hoặc không xác định
  description!: string;
  createdBy!: string;
  createdDate!: string;
  modifiedBy!: string;
  modifiedDate!: string;
  status!: number;
  productDetails: ProductDetail[] = [];
}
