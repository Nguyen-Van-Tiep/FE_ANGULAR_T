import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/app/environment/env';
const BASE_API = env.baseApi;

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private api = BASE_API + 'user/forgot-password';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };
  constructor(private http: HttpClient) {}
  forgotPassword(username: string, email: string) {
    const requestBody = { username, email };
    return this.http.post(this.api, requestBody, this.httpOptions);
  }
}
