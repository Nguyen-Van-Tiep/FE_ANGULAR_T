import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { OrdersRequest } from 'src/app/commons/request/OrdersRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { BillsResponse } from 'src/app/commons/response/BillsResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { BillResult } from 'src/app/commons/result/BillResult';
import { BillService } from 'src/app/service/bill/bill.service';

@Component({
  selector: 'app-order-customer',
  templateUrl: './order-customer.component.html',
  styleUrls: ['./order-customer.component.css'],
})
export class OrderCustomerComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: BillsResponse;
  bills: any;
  loading: boolean = false;
  searchValue: string = '';
  sortField: string = '';
  sortOrder: string = '';
  request: OrdersRequest;
  error: ErrorResponse;
  blockSpace: RegExp = /[^s]/;
  @ViewChild('pd') pd!: Table;
  filteredUsers: BillResult[] = [];
  constructor(
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.baseResponse = new BaseResponse();
    this.response = new BillsResponse();
    this.request = new OrdersRequest();
    this.request.status = 'P';
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 10;
    this.response.pagination.pageNumber = 0;
    this.error = new ErrorResponse();
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const status = params['status'];
      if (status) {
        this.request.status = status;
        this.getBills();
      }
    });
  }

  applyFilter() {
    console.log('shafjsadfjjk');

    this.filteredUsers = this.response.bills.filter((user: BillResult) => {
      let matchesStatus = true;
      let matchesDateRange = true;
      let matchesSearchValue = true;

      if (this.searchValue) {
        const searchTerm = this.searchValue.toLowerCase();
        matchesSearchValue =
          user.code.toLowerCase().includes(searchTerm) ||
          user.numberPhone.includes(searchTerm) ||
          user.customerName.toLowerCase().includes(searchTerm) ||
          user.createdBy.toLowerCase().includes(searchTerm) ||
          (user.createdDate.toString().includes(searchTerm) && // Chuyển đổi Date thành chuỗi
            user.status.toLowerCase().includes(searchTerm));
      }

      console.log('Filtered Users:', this.filteredUsers);
      return matchesStatus && matchesDateRange && matchesSearchValue;
    });
  }
  applyFilterGlobal(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const searchValue = target.value.trim().toLowerCase();
      const regex = new RegExp(`\\b${searchValue}\\b`, 'i'); // Tạo Regex từ searchValue
      this.filteredUsers = this.response.bills.filter(
        (bill: BillResult) =>
          bill.code.toLowerCase().match(regex) ||
          bill.numberPhone.toLowerCase().match(regex) ||
          bill.customerName.toLowerCase().match(regex) ||
          bill.createdDate.toString().toLowerCase().match(regex) ||
          bill.modifiedDate.toString().toLowerCase().match(regex) ||
          bill.receiveDate.toString().toLowerCase().match(regex) ||
          bill.status.toLowerCase().match(regex)
      );
    }
  }
  getBills() {
    this.loading = true;
    this.billService
      .getBillsCustomer(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize,
        this.sortField,
        this.sortOrder
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<any>;
          this.response = this.baseResponse.data;
          this.filteredUsers = [...this.response.bills];
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onSort(event: any) {
    const sortField = event.field;
    const sortOrder = event.order === 1 ? 'asc' : 'desc';
    if (sortField !== this.sortField || sortOrder !== this.sortOrder) {
      this.sortField = sortField;
      this.sortOrder = sortOrder;
      this.getBills();
    }
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getBills();
  }

  onFilterChange(event: any) {
    this.searchValue = event.target.value;
    this.getBills();
  }

  onSearch() {
    this.getBills();
  }

  clearFilter(table: any) {
    table.clear();
    this.searchValue = '';
    this.sortField = '';
    this.sortOrder = '';
    this.getBills();
  }

  gotoDetail(code: string) {
    this.router.navigate(['/profile/order-detail', code]);
  }

  changeStatus(
    status: any,
    pending: any,
    waiting: any,
    transporting: any,
    finished: any
  ) {
    const index = status.index;
    pending.clear();
    waiting.clear();
    transporting.clear();
    finished.clear();

    if (index === 0) {
      this.request.status = 'P';
    } else if (index === 1) {
      this.request.status = 'W';
    } else if (index === 2) {
      this.request.status = 'T';
    } else if (index === 3) {
      this.request.status = 'F';
    }
    this.router.navigate(['/admin/order/status', this.request.status]);

    this.searchValue = '';
    this.sortField = '';
    this.sortOrder = '';
    this.getBills();
  }
}
