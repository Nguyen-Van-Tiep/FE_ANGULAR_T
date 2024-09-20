import { PaginationInfo } from "../info/PaginationInfo";
import { CouponResult } from "../result/CouponResult";

export class CouponsResponse {
    coupons !: CouponResult[];
    pagination!: PaginationInfo;
}