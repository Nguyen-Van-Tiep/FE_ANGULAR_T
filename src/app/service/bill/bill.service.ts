import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApproveBillRequest } from 'src/app/commons/request/ApproveBillRequest';
import { OrdersRequest } from 'src/app/commons/request/OrdersRequest';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class BillService {
  api = BASE_API + 'admin/bill';
  api2 = BASE_API + 'dash-board';
  constructor(private http: HttpClient, private commonService: CommonService) {}

  getBills(
    request: OrdersRequest,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ) {
    return this.http.post(
      this.api +
        '/get-bills?page=' +
        page +
        '&size=' +
        size +
        '&sortField=' +
        sortField +
        '&sortOrder=' +
        sortOrder,
      request,
      this.commonService.gethttpOptions()
    );
  }
  getBillsCustomer(
    request: OrdersRequest,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ) {
    return this.http.post(
      this.api +
        '/get-bills/customer?page=' +
        page +
        '&size=' +
        size +
        '&sortField=' +
        sortField +
        '&sortOrder=' +
        sortOrder,
      request,
      this.commonService.gethttpOptions()
    );
  }
  detailBill(code: string) {
    return this.http.get(
      this.api + '/detail/' + code,
      this.commonService.gethttpOptions()
    );
  }
  detailBillCustomer(code: string) {
    return this.http.get(
      this.api + '/detail-customer/' + code,
      this.commonService.gethttpOptions()
    );
  }
  approveBill(request: ApproveBillRequest) {
    return this.http.post(
      this.api + '/approve',
      request,
      this.commonService.gethttpOptions()
    );
  }
  getStatisticsByDay() {
    return this.http.get(`${this.api2}/day`);
  }

  getStatisticsByWeek() {
    return this.http.get(`${this.api2}/week`);
  }

  getStatisticsByMonth() {
    return this.http.get(`${this.api2}/month`);
  }

  getStatisticsByYear() {
    return this.http.get(`${this.api2}/year`);
  }
}
