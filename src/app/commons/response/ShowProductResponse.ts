import { BrandResponse } from './BrandResponse';
import { MaterialResponse } from './MaterialResponse';
import { ShowProductDetail } from './ShowProductDetail';

import { SoleResponse } from './SoleResponse';
import { StyleResponse } from './StyleResponse';

export class ShowProductResponse {
  image!: string;
  size!: string;
  id!: number;
  productName!: string;
  brand!: BrandResponse;
  style!: StyleResponse;
  material!: MaterialResponse;
  sole!: SoleResponse;
  description!: string;
  createdBy!: string;
  createdDate!: string;
  modifiedBy!: string;
  modifiedDate!: string;
  status!: number;
  productDetailList!: ShowProductDetail[];
  quantity!: number;
  price!: number;
}
