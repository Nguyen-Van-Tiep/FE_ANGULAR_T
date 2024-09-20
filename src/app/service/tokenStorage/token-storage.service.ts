import { Injectable } from '@angular/core';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { LoginResponse } from 'src/app/commons/response/LoginResponse';
const TOKEN_KEY = 'Authorization';
const USER_KEY = 'auth-user';
const USER_INFO = 'userInfo';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  userResponse:BaseResponse<LoginResponse>
  constructor() { 
    this.userResponse = new BaseResponse();
  }

  
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | any {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public getUsername():string{
    const user = localStorage.getItem(USER_INFO)
    if(user){
      this.userResponse = JSON.parse(user) as BaseResponse<LoginResponse>;
      return this.userResponse.data.username;
    }
    return '';
  }

  public saveCache(key: string, value: any, expireMinutes: number) {
    const expireTime = new Date().getTime() + expireMinutes * 60000;
    const data = {
      value: value,
      expireTime: expireTime
    };
    localStorage.setItem(key, JSON.stringify(data));
  }

  public isExists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  public getCache(key: string): any {
    const data = localStorage.getItem(key);
    if (data) {
      const dataJson = JSON.parse(data);
      if (dataJson.expireTime > new Date().getTime()) {
        return dataJson.value;
      }
    }
    return null;
  }

}
