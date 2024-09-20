import { PaginationInfo } from '../info/PaginationInfo';
import { AddressResult } from '../result/AddressResult';

export class AddressesResponse {
  userID!: number;
  addresses!: AddressResult[];
  username!: string;
  pagination!: PaginationInfo;
}
