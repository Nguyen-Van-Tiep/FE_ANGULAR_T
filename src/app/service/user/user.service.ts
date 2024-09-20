import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class UserService {
  api = BASE_API + 'user';

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  // Example method to update user information
  updateUser(userInfo: UserInfoResponse) {
    return this.http.put(this.api + '/update/personal-information-management',userInfo,this.commonService.gethttpOptions());
  }
  getUserInfo() {
    return this.http.get(this.api + '/info', this.commonService.gethttpOptions());
  }
}
