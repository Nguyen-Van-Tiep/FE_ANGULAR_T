import { CustomerDTO } from '../dto/CustomerDTO';
import { PaginationInfo } from '../info/PaginationInfo';

export class CustomerResponse {
  customers!: CustomerDTO[];
  username!: string;
  pagination!: PaginationInfo;
}
