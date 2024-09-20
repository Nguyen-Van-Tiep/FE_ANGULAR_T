import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ShippingFeeResponse } from 'src/app/commons/response/ShippingFeeResponse';

@Injectable({
  providedIn: 'root',
})
export class GhnService {
  private url = 'https://online-gateway.ghn.vn/shiip/public-api/';
  private token = '08dabd09-6a6f-11ef-9cca-ae886ec3a600';
  constructor(private http: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  getProvinces() {
    return this.http.get(`${this.url}master-data/province`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Token: this.token,
      }),
    });
  }

  getDistricts(ProvinceID: number) {
    return this.http.get(
      `${this.url}master-data/district?province_id=${ProvinceID}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Token: this.token,
        }),
      }
    );
  }

  getWards(DistrictID: number) {
    return this.http.get(
      `${this.url}master-data/ward?district_id=${DistrictID}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Token: this.token,
        }),
      }
    );
  }

  calculateShippingFee(data: any): Observable<ShippingFeeResponse> {
    return this.http.post<ShippingFeeResponse>(
      `${this.url}v2/shipping-order/fee`,
      data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Token: this.token,
          ShopId: '5302392',
        }),
      }
    );
  }
}
