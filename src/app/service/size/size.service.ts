import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common/common.service';
import { SizeRequest } from 'src/app/commons/request/SizeRequest';
import { SizeResponse } from 'src/app/commons/response/SizeResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class SizeService {
  api = BASE_API + "auth/sizes";
  constructor(
    private http: HttpClient,
    private common: CommonService
  ) {

  }
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':`Bearer `+ this.token!,
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
  getAllSize(){
    return this.http.get(this.api+'/getAllSizes', this.httpOptions)
  }

  getList(request: SizeRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-sizes?page=' +page +'&size=' +size,request,this.httpOptions);
  }
  save(request: SizeResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  
  changStatus(request: SizeResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }

  update(request: SizeResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }
}
