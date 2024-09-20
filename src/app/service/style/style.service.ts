import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StyleRequest } from 'src/app/commons/request/StyleRequest';
import { StyleResponse } from 'src/app/commons/response/StyleResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class StyleService {
  api = BASE_API + "auth/style";
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

  getAllStyle(){
    return this.http.get(this.api + '/getAllStyle',this.httpOptions)
  }

  getAllForC(){
    return this.http.get(this.api + '/getAllStyles',this.httpOptions)
  }

  getList(request: StyleRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-styles?page=' +page +'&size=' +size,request,this.httpOptions);
  }
  save(request: StyleResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  
  changStatus(request: StyleResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }

  update(request: StyleResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }
}
