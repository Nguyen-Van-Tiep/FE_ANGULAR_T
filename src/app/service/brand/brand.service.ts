import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CommonService } from '../common/common.service';
import { env } from '../../environment/env';
import { SaveBrandRequest } from '../../commons/request/SaveBrandRequset';
import { BrandsRequest } from '../../commons/request/BrandsRequest';
import { BrandResponse } from 'src/app/commons/response/BrandResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class BrandService {
  api = BASE_API + 'auth/brand';
  constructor(private http: HttpClient, private common: CommonService) { }
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  httpUpload = {
    headers: new HttpHeaders({
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };

  getAllBrand() {
    return this.http.get(this.api + '/getAllBrand', this.httpOptions);
  }

  getAllForC(){
    return this.http.get(this.api + '/getAllBrands', this.httpOptions);
  }

  getList(request: BrandsRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-brands?page=' +page +'&size=' +size,request,this.httpOptions);
  }

  save(request: BrandResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  changStatus(request: BrandResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }
  
  update(request: BrandResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }
}
