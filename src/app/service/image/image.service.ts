import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environment/env';
import { CommonService } from '../common/common.service';
import { ImageResult } from '../../commons/result/ImageResult';
import { ImageRequest } from '../../commons/request/ImageRequest';



const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  api = BASE_API + "auth/image";
  constructor(
    private http: HttpClient,
    private common: CommonService
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
  uploadFile(imgs: ImageRequest[]){
    return this.http.post(this.api + '/uploads', imgs, this.httpOptions);
  }
}
