import { Component, OnInit } from '@angular/core';
import { registerRequest } from 'src/app/commons/request/RegisterRequest';
import { RegisterService } from 'src/app/service/auth/register/register.service';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { MessageService } from 'primeng/api';
import { LoginResponse } from 'src/app/commons/response/LoginResponse';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { TokenStorageService } from 'src/app/service/tokenStorage/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  loading: boolean = false;
  request: registerRequest;
  confirmPassword: string = '';
  error: ErrorResponse;
  response: BaseResponse<LoginResponse>;
  constructor(
    private registerService: RegisterService,
    private messageService: MessageService,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {
    this.request = new registerRequest();
    this.request.roles = '2';
    this.error = new ErrorResponse();
    this.response = new BaseResponse();
  }

  ngOnInit() {}

  usernameError: string | null = null;
  phoneError: string | null = null;
  passwordError: string | null = null;
  emailError: string | null = null;

  validateUsername(value: string): void {
    const userPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!userPattern.test(value)) {
      this.usernameError = 'Tài khoản không hợp lệ';
    } else {
      this.usernameError = null;
    }
  }
  validateEmail(value: string): void {
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if (!emailPattern.test(value)) {
      this.emailError = 'Email không hợp lệ';
    } else {
      this.emailError = null;
    }
  }
  validatePhoneNumber(value: string): void {
    const phonePattern = /^(0[1-9]|84[1-9])([0-9]{8,9})$/;
    if (!phonePattern.test(value)) {
      this.phoneError = 'Số điện thoại không hợp lệ';
    } else {
      this.phoneError = null;
    }
  }
  validatePasswords(): void {
    if (this.request.password !== this.confirmPassword) {
      this.passwordError = 'Mật khẩu và xác nhận mật khẩu không khớp';
    } else {
      this.passwordError = null;
    }
  }
  isFormValid() {
    return (
      !this.usernameError &&
      !this.emailError &&
      !this.phoneError &&
      !this.passwordError &&
      this.request.username &&
      this.request.email &&
      this.request.numberPhone &&
      this.request.password &&
      this.confirmPassword
    );
  }
  register() {
    this.validateUsername(this.request.username);
    this.validatePhoneNumber(this.request.numberPhone);
    this.validateEmail(this.request.email);
    this.validatePasswords();
    if (this.isFormValid()) {
      this.loading = true;
      // Add your registration logic here
    }
    this.registerService.register(this.request).subscribe(
      (response) => {
        this.response = response as BaseResponse<LoginResponse>;
        localStorage.setItem('token', this.response.data.token);
        localStorage.setItem('role', JSON.stringify(this.response.data.role));
        localStorage.setItem('userInfo', JSON.stringify(this.response));
        this.tokenStorageService.saveToken(this.response.data.token);
        this.messageService.add({
          severity: 'success',
          summary: 'Đăng ký thành công!',
        });
        this.loading = false;
        this.router.navigate(['/']);
      },
      (error) => {
        this.loading = false;
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Đăng ký thất bại!',
          detail: this.error.msgError,
        });
      }
    );
  }
  goBack() {
    window.history.back();
  }
}
