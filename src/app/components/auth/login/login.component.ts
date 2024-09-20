import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { log } from 'console';
import { MessageService } from 'primeng/api';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { LoginResponse } from 'src/app/commons/response/LoginResponse';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ForgotPasswordService } from 'src/app/service/auth/forgot-password/forgot-password.service';
import { TokenStorageService } from 'src/app/service/tokenStorage/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  token!: string;
  response: BaseResponse<LoginResponse>;
  error: ErrorResponse;
  isForgot: boolean = false;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private forgotPasswordService: ForgotPasswordService,
    private tokenStorageService: TokenStorageService
  ) {
    this.response = new BaseResponse();
    this.error = new ErrorResponse();
  }
  login() {
    this.token = 'Basic ' + btoa(this.username + ':' + this.password);
    console.log(this.token);
    // Gửi dữ liệu đăng nhập về cho backend
    this.authService.login(this.token).subscribe(
      (response) => {
        this.response = response as BaseResponse<LoginResponse>;
        const userInfo = {
          username: this.response.data.username,
          role: this.response.data.role[0], // Lưu vai trò đầu tiên
          email: this.response.data.email,
        };
        localStorage.setItem('token', this.response.data.token);
        localStorage.setItem('role', JSON.stringify(this.response.data.role));
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.tokenStorageService.saveToken(this.response.data.token);
        if (this.response.data.role.includes('ADMIN_ROLE')) {
          this.showError('"Bạn không có quyền truy cập vào trang này!"');
        } else {
          this.showSuccess('Đăng nhập thành công');
          window.history.back();
        }
      },
      (error) => {
        if (error.error && error.error.message) {
          this.showError(error.error.message);
        } else {
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'thực hiện thành công',
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }

  goRegister() {
    this.router.navigate(['/auth/register']);
  }
  showDialog() {
    this.isForgot = true;
  }

  submit() {
    // You can implement your password reset logic here
    // Example: Call a service method to handle the password reset
    this.forgotPasswordService
      .forgotPassword(this.username, this.email)
      .subscribe(
        (response) => {
          // Handle success, e.g., show success message
          this.messageService.add({
            severity: 'success',
            summary: 'Yêu cầu đã được gửi.',
          });
          this.isForgot = false; // Close the dialog
        },
        (error) => {
          // Handle error, e.g., show error message
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi khi gửi yêu cầu.',
            detail: error.message,
          });
        }
      );
  }

  close() {
    this.isForgot = false;
  }

  disableSubmitButton() {
    if (this.username == '') {
      return true;
    }
    return false;
  }
}
