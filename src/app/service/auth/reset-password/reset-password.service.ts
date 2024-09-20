import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePasswordRequest } from 'src/app/commons/request/ChangePassword';
import { env } from 'src/app/environment/env';
import { CommonService } from '../../common/common.service';
const BASE_API = env.baseApi;

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private api = BASE_API + 'user/reset-password';
  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { 

  }
  changePassword(request: ChangePasswordRequest) {
    return this.http.post(
      this.api,
      {
        oldPassword: request.oldPassword,
        newPassword: request.newPassword,
        confirmPassword: request.confirmPassword,
      },
      this.commonService.gethttpOptions()
    );
  }
}
