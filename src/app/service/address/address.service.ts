import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
import { AddressRequest } from 'src/app/commons/request/AddressRequest';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  api = BASE_API + 'user/account/address';
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
  getAddressById(id: number) {
    return this.http.get(this.api + '/get-address/' + id, this.httpOptions);
  }
  saveAddress(request: AddressRequest) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  saveAddressID(userID: number, request: AddressRequest) {
    return this.http.post(
      this.api + '/save/' + userID,
      request,
      this.httpOptions
    );
  }
  // updateAddress(request: CreateAddressRequest, id: number) {
  //   return this.http.put(this.api + '/update' + id, request, this.httpOptions);
  // }
  removeAddress(id: number) {
    return this.http.delete(this.api + '/delete/' + id, this.httpOptions);
  }
  getAddresses(page: number, size: number) {
    return this.http.get(
      this.api + '/get-addresses?page=' + page + '&size=' + size,
      this.httpOptions
    );
  }
  getAddressesID(id: number, page: number, size: number) {
    return this.http.get(
      this.api + '/user/' + id + '/addresses?page=' + page + '&size=' + size,
      this.httpOptions
    );
  }
  setDefaultAddress(id: number) {
    return this.http.get(this.api + '/set-default/' + id, this.httpOptions);
  }

  setDefaultAddressID(id: number, userID: number) {
    return this.http.get(
      this.api + '/info/set-default/' + id + '?userID=' + userID,
      this.httpOptions
    );
  }
}
