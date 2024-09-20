import { PaginationInfo } from '../info/PaginationInfo';
import { ProductResult } from '../result/ProductResult';

export class ProductsResponse {
  products!: ProductResult[];
  pagination!: PaginationInfo;
}
