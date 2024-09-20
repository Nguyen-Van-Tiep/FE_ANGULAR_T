import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from 'src/app/commons/response/UserInfoResponse';
import { MessageService } from 'primeng/api';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { UserService } from 'src/app/service/user/user.service';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-general-customer',
  templateUrl: './general-customer.component.html',
  styleUrls: ['./general-customer.component.css'],
})
export class GeneralCustomerComponent implements OnInit {
  currentUser: any = {};
  response: UserInfoResponse;
  userResponse: BaseResponse<UserInfoResponse>;
  blockSpace: RegExp = /[^s]/;
  isDisable: Boolean = false;
  isValid: Boolean = true;
  maxDate: Date = new Date();
  error: ErrorResponse;
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {
    this.response = new UserInfoResponse();
    this.userResponse = new BaseResponse<UserInfoResponse>();
    this.error = new ErrorResponse();
  }
  ngOnInit(): void {
    this.getUserInfo();
  }
  getUserInfo(): void {
    this.userService.getUserInfo().subscribe(
      (data) => {
        this.userResponse = data as BaseResponse<UserInfoResponse>;
        this.response = {
          ...this.userResponse.data,
          fullName: this.userResponse.data.fullName || '',
        }; // Assuming 'data' contains the actual user info
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        this.messageService.add({
          severity: 'error',
          summary: 'Error fetching user info!',
          detail: this.error.msgError,
        });
      }
    );
  }

  edit() {
    this.isDisable = !this.isDisable;
  }
  btnConfirm() {
    // Chuyển đổi định dạng ngày sinh nếu birthOfDate không null
    const formattedDate = this.response.birthOfDate
      ? this.datePipe.transform(this.response.birthOfDate, 'dd/MM/yyyy')
      : '';

    // Đảm bảo updatedResponse luôn có birthOfDate là string
    const updatedResponse = {
      ...this.response,
      birthOfDate: formattedDate || '',
    };
    this.userService.updateUser(updatedResponse).subscribe(
      (response) => {
        this.isDisable = true;
        this.showSuccess('chỉnh sửa thành công');
      },
      (error) => {
        this.showError('Có lỗi xảy ra');
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Thành công',
      detail: message,
    });
  }
  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Thất bại',
      detail: message,
    });
  }

  validate(key: string) {
    if (!key || key.trim() === '') {
      this.isValid = false;
    }
    this.isValid = true;
  }
  formatMyDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
}
