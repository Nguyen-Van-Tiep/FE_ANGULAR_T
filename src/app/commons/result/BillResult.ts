export class BillResult {
  id!: number;
  code!: string;
  customerId!: number;
  customerName!: string;
  numberPhone!: string;
  createdBy!: string;
  modifiedBy!: string;
  total!: number;
  quantity!: number;
  status!: string;
  createdDate!: Date;
  modifiedDate!: Date;
  note!: string;
  price!: number;
  receiveDate!: Date;
  estimatedDeliveryDate!: Date;
}
