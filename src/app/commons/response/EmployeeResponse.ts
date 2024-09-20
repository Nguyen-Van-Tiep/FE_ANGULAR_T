import { EmployeeDTO } from '../dto/EmployeeDTO';
import { PaginationInfo } from '../info/PaginationInfo';

export class EmployeeResponse {
  employees!: EmployeeDTO[];
  username!: string;
  pagination!: PaginationInfo;
}
