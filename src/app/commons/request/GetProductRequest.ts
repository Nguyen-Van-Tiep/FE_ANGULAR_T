import { BrandResponse } from '../response/BrandResponse';
import { MaterialResponse } from '../response/MaterialResponse';
import { SoleResponse } from '../response/SoleResponse';
import { StyleResponse } from '../response/StyleResponse';

export class GetProductRequest {
  name!: string;
  prices!: number[];
  styles!: StyleResponse[];
  brands!: BrandResponse[];
  soles!: SoleResponse[];
  materials!: MaterialResponse[];
  // filterCount:number=0;
}
