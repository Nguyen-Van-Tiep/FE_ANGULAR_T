import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PaymentRequest } from 'src/app/commons/request/PaymentRequest';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
import { CreatePaymentRequest } from 'src/app/commons/request/CreatepaymentRequest';
const BASE_API = env.baseApi;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  api = BASE_API + 'payment';
  getHttpOptions() {
    const token = localStorage.getItem('token')?.trim();
    if (token) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          Accept: '*/*',
        }),
      };
    }
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: '*/*',
      }),
    };
  }
  constructor(private http: HttpClient, private commonService: CommonService) {}

  validatePayment(request: PaymentRequest) {
    return this.http.post(
      this.api + '/validate',
      request,
      this.commonService.gethttpOptions()
    );
  }

  getInfoPayment(code: string) {
    return this.http.get(
      this.api + '/' + code,
      this.commonService.gethttpOptions()
    );
  }

  createPayment(request: CreatePaymentRequest) {
    return this.http.post(this.api + '/create', request, this.getHttpOptions());
  }

  userInfor() {
    return this.http.get(
      this.api + '/user-info',
      this.commonService.gethttpOptions()
    );
  }
}
