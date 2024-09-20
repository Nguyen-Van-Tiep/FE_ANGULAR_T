export class CouponResponse {
    id !: number;
    code !: string;
    name !: string;
    type !: number;
    quantity !: number;
    value !: number;
    condition !: number;
    startDate !: Date;
    endDate !: Date;
    status !: number;
}