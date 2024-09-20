import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CommonService } from '../common/common.service';
import { env } from '../../environment/env';
import { CouponsRequest } from '../../commons/request/CouponsRequest';
import { CouponResponse } from '../../commons/response/CouponResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class CouponService {
  api = BASE_API + 'auth/coupons';
  private id!: number;

  // api = "http://localhost:4200/auth/coupon";
  constructor(private http: HttpClient) // private common: CommonService
  {}
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      accept: '*/*',
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };

  getCoupon(
    request: CouponsRequest,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string,
    status: number | null = null
  ) {
    return this.http.post(
      this.api +
        '/get-coupons?page=' +
        page +
        '&size=' +
        size +
        '&sortField=' +
        sortField +
        '&sortOrder=',
      request,
      this.httpOptions
    );
  }

  postCoupon(cp: CouponResponse) {
    return this.http.post(this.api + '/add-coupons', cp, this.httpOptions);
  }

  putCoupon(coupon: CouponResponse) {
    return this.http.put(
      this.api + '/update-coupons/' + coupon.id,
      coupon,
      this.httpOptions
    );
  }

  getCouponById(id: number) {
    return this.http.get(this.api + '/find/' + id, this.httpOptions);
  }

  setSelectedData(id: number) {
    this.id = id;
  }

  getSelectedData() {
    return this.id;
  }
}
