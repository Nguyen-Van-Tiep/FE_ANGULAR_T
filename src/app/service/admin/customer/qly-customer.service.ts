import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
import { CommonService } from '../../common/common.service';
import { CustomersRequest } from 'src/app/commons/request/CustomersRequest';
import { CreateUserRequest } from 'src/app/commons/request/CreateUserRequest';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { UserDTO } from 'src/app/commons/dto/UserDTO';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class QlyCustomerService {
  api = BASE_API + 'admin';
  api2 = BASE_API;
  api3 = BASE_API + 'user';
  constructor(private http: HttpClient, private common: CommonService) {}
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  getAllCustomer() {
    return this.http.get(this.api + '/get-all/customer', this.httpOptions);
  }
  getCustomers(
    request: CustomersRequest,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ) {
    return this.http.post(
      this.api +
        '/get-customer?page=' +
        page +
        '&size=' +
        size +
        '&sortField=' +
        sortField +
        '&sortOrder=' +
        sortOrder,
      request,
      this.httpOptions
    );
  }
  getStatus() {
    return this.http.get(this.api + '/customer/statuses', this.httpOptions);
  }
  updateStatus(id: number, status: boolean) {
    return this.http.post(
      this.api +
        '/update-status-user/' +
        id +
        '?status=' +
        `${status ? 'Hoạt động' : 'Ngừng hoạt động'}`,
      this.httpOptions
    );
  }
  removeEmployee(id: number) {
    return this.http.delete(
      this.api + '/delete-employee/' + id,
      this.httpOptions
    );
  }
  openlockedEmployee(id: number) {
    return this.http.post(
      this.api + '/open-locked-employee/' + id,
      this.httpOptions
    );
  }

  lockedEmployee(id: number) {
    return this.http.post(
      this.api + '/locked-employee/' + id,
      this.httpOptions
    );
  }

  createUser(request: CreateUserRequest) {
    return this.http.post(this.api2 + 'create-user', request, this.httpOptions);
  }
  getUserInfo(id: number) {
    return this.http.get(this.api + '/user/' + id, this.httpOptions);
  }
  updateUser(userInfo: UserDTO, id: number) {
    //
    return this.http.put(
      this.api3 + '/update-user/' + id,
      userInfo,
      this.httpOptions
    );
  }
}
