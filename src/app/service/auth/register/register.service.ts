import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from 'src/app/environment/env';
import { registerRequest } from 'src/app/commons/request/RegisterRequest';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private api = BASE_API + 'register';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  constructor(private http: HttpClient) {}
  register(request: registerRequest): Observable<any> {
    return this.http.post(this.api, request, this.httpOptions);
  }
}
