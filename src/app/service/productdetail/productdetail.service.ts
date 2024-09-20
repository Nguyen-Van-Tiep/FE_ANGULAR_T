import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductDetailRequest } from '../../commons/request/ProductDetailRequest';
import { ProductDetail } from '../../commons/result/ProductDetail';
import { ProductDetailResponse } from '../../commons/response/ProductDetailResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class ProductdetailService {

  api = BASE_API + "auth/productDetail";
  private id !: number;
  constructor(
    private http: HttpClient
  ) { }
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    })
  };
  httpUpload = {
    headers: new HttpHeaders({
      'Authorization':`Bearer `+ this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    }),
  };

  getProductDetails(request: ProductDetailRequest, page: number, size: number){
    return this.http.post(this.api+'/getDetails?page='+page+'&size='+size,request, this.httpOptions)
  }

  updateAllPD(listPD: ProductDetailResponse[]){
    return this.http.put(this.api + '/update-productDetails',listPD,this.httpOptions)
  }

  getProductDetail(pdID : number){
    return this.http.post(this.api+'/getDetail',pdID,this.httpOptions)
  }
  
  updatePD(idPro: number, pd: ProductDetailResponse){
    return this.http.put(this.api+'/update-productDetail'+'/'+idPro,pd,this.httpOptions)
  }

  changStatus( pd : number){
    return this.http.put(this.api+'/changStatusPD/'+pd,this.httpOptions)
  }
}


