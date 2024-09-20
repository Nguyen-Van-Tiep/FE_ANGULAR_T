import { OrderDetailResult } from '../result/OrderDetailResult';
import { OrderGeneralResult } from '../result/OrderGeneralResult';
import { SubOrderResult } from '../result/SubOrderResult';

export class DetailOrderResponse {
  id!: number;
  orderCode!: String;
  generals!: OrderGeneralResult[];
  details!: OrderDetailResult[];
  products!: SubOrderResult[];
  username!: string;
  fullName!: string;
  numberPhone!: string;
  fullAddress!: string;
  status!: string;
  price!: number;
  sumPrice!: number;
  fee!: number;
  paymentMethod!: string;
  statusCode!: string;
  receiveDate!: string;
}
