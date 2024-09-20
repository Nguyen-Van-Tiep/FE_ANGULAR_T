import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../../common/common.service';
import { env } from 'src/app/environment/env';
import { EmployeesRequest } from 'src/app/commons/request/EmployeesRequest';
import { EmployeeRequest } from 'src/app/commons/request/EmployeeRequest';
import { EmployeeDTO } from 'src/app/commons/dto/EmployeeDTO';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  api = BASE_API;
  api1 = BASE_API + 'admin';
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
  getEmployees(
    request: EmployeesRequest,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ) {
    return this.http.post(
      this.api +
        'admin/get-employee?page=' +
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
  getCreate(request: EmployeeRequest) {
    return this.http.post(
      this.api + 'admin/create-employee',
      request,
      this.httpOptions
    );
  }
  getAllEmployee() {
    return this.http.get(this.api + 'admin/get-all/employee', this.httpOptions);
  }
  removeEmployee(id: number) {
    return this.http.delete(
      this.api + 'admin/delete-employee/' + id,
      this.httpOptions
    );
  }
  lockedEmployee(id: number) {
    return this.http.post(
      this.api + 'admin/locked-employee/' + id,
      this.httpOptions
    );
  }
  updateStatus(id: number, status: boolean) {
    return this.http.post(
      this.api1 +
        '/update-status-user/' +
        id +
        '?status=' +
        `${status ? 'Hoạt động' : 'Ngừng hoạt động'}`,
      this.httpOptions
    );
  }
  getUserInfo(id: number) {
    return this.http.get(this.api1 + '/user/' + id, this.httpOptions);
  }
  updateUser(userInfo: EmployeeDTO, id: number) {
    //
    return this.http.put(
      this.api3 + '/update-user/' + id,
      userInfo,
      this.httpOptions
    );
  }
}
