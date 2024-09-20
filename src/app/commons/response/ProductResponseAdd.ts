import { PaginationInfo } from "../info/PaginationInfo";
import { ProductDetail } from "../result/ProductDetail";
import { ProductResult } from "../result/ProductResult";
import { BrandResponse } from "./BrandResponse";
import { MaterialResponse } from "./MaterialResponse";
import { SoleResponse } from "./SoleResponse";
import { StyleResponse } from "./StyleResponse";

export class ProductResponseAdd{
    id !: number;
    productName !: string;
    brandID !: BrandResponse;
    styleID !: StyleResponse;
    materialID !: MaterialResponse;
    soleID !: SoleResponse;
    description !: string;
    createdBy !: string;
    createdDate !: string
    modifiedBy !: string;
    modifiedDate !: string;
    status !: number;
}