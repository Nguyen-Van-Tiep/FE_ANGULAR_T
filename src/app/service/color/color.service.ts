import { Injectable } from '@angular/core';
import { env } from '../../environment/env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common/common.service';
import { ColorRequest } from 'src/app/commons/request/ColorRequest';
import { ColorResponse } from 'src/app/commons/response/ColorResponse';

const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class ColorService {
  api = BASE_API + "auth/colors";
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

  getAllColor(){
    return this.http.get(this.api+'/getAllColors', this.httpOptions)
  }

  getList(request: ColorRequest,page: number,  size: number,
  ) {
    return this.http.post(this.api +'/get-colors?page=' +page +'&size=' +size,request,this.httpOptions);
  }

  save(request: ColorResponse) {
    return this.http.post(this.api + '/save', request, this.httpOptions);
  }

  changStatus(request: ColorResponse) {
    return this.http.put(this.api + '/changeStatus',request, this.httpOptions);
  }

  update(request: ColorResponse) {
    return this.http.put(this.api + '/update', request,this.httpOptions);
  }
}
