import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SoleRequest } from 'src/app/commons/request/SoleRequest';
import { SoleResponse } from 'src/app/commons/response/SoleResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class SoleService {
  api = BASE_API + "auth/sole";
  constructor(
    private http: HttpClient
  ) { }

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

  getAllSole(){
    return this.http.get(this.api + '/getAllSole', this.httpOptions)
  }

  getAllForC(){
    return this.http.get(this.api + '/getAllSoles', this.httpOptions)
  }

  getList(request: SoleRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-soles?page=' +page +'&size=' +size,request,this.httpOptions);
  }
  save(request: SoleResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  
  changStatus(request: SoleResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }

  update(request: SoleResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }
}
