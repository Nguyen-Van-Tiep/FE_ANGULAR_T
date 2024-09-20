import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MaterialRequest } from 'src/app/commons/request/MaterialRequest';
import { MaterialResponse } from 'src/app/commons/response/MaterialResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  api = BASE_API + "auth/material";
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

  getAllMaterial(){
    return this.http.get(this.api + '/getAllMaterial', this.httpOptions)
  }

  getAllForC(){
    return this.http.get(this.api + '/getAllMaterials', this.httpOptions)
  }

  getList(request: MaterialRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-materials?page=' +page +'&size=' +size,request,this.httpOptions);
  }
  save(request: MaterialResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  
  changStatus(request: MaterialResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }

  update(request: MaterialResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }

}
