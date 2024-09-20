import { BrandResponse } from '../response/BrandResponse';
import { MaterialResponse } from '../response/MaterialResponse';
import { SoleResponse } from '../response/SoleResponse';
import { StyleResponse } from '../response/StyleResponse';

export class ProductResult {
  id!: number;
  productName!: string;
  brand!: BrandResponse;
  style!: StyleResponse;
  material!: MaterialResponse;
  sole!: SoleResponse;
  description!: string;
  gender!: number;
  createdBy!: string;
  createdDate!: string;
  modifiedBy!: string;
  modifiedDate!: string;
  status!: number;
}
