import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApproveBillRequest } from 'src/app/commons/request/ApproveBillRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { DetailOrderResponse } from 'src/app/commons/response/DetailOrderResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { BillService } from 'src/app/service/bill/bill.service';

@Component({
  selector: 'app-order-detail-admin',
  templateUrl: './order-detail-admin.component.html',
  styleUrl: './order-detail-admin.component.css',
})
export class OrderDetailAdminComponent implements OnInit {
  code: string;
  response: DetailOrderResponse;
  baseResponse: BaseResponse<any>;
  error: ErrorResponse;
  button: string = 'Xác nhận';
  cancel: string = 'từ chối';
  statusApprove: string = 'W';
  statusReject: string = 'R';
  request: ApproveBillRequest;
  isDone: boolean = false;
  constructor(
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private billService: BillService,
    private messageService: MessageService
  ) {
    this.baseResponse = new BaseResponse();
    this.error = new ErrorResponse();
    this.response = new DetailOrderResponse();
    this.code = this.route.snapshot.params['code'];
    this.request = new ApproveBillRequest();
  }

  ngOnInit(): void {
    this.billService.detailBill(this.code).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data as DetailOrderResponse;
        if (this.response.statusCode == 'W') {
          this.button = 'Giao hàng';
          this.cancel = 'hủy Đơn';
          this.statusApprove = 'T';
          this.statusReject = 'C';
        } else if (this.response.statusCode == 'T') {
          this.button = 'Hoàn thành';
          this.cancel = 'hủy Đơn';
          this.statusApprove = 'F';
          this.statusReject = 'R';
        } else if (
          this.response.statusCode == 'F' ||
          this.response.statusCode == 'R' ||
          this.response.statusCode == 'C'
        ) {
          this.isDone = true;
        }
      },
      (error) => {
        if (Array.isArray(error.error)) {
          // Hiển thị từng lỗi
          error.error.forEach((message: string) => {
            this.showError(message);
          });
        } else {
          // Nếu không phải là mảng, hiển thị thông báo lỗi chung
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
      }
    );
  }

  goBack() {
    window.history.back();
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'chỉnh sửa thành công',
      detail: message,
    });
  }
  confirmApprove(event: Event, action: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn thay đổi trạng thái?',
      header: 'Xác nhận thay đổi trạng thái',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.request.id = this.response.id;
        this.request.status = action;
        this.billService.approveBill(this.request).subscribe(
          (data) => {
            this.baseResponse = data as BaseResponse<any>;
            this.showSuccess('phê duyệt thành công');
            this.response.statusCode = action;
            window.location.reload();
          },
          (error) => {
            this.error = error.error as ErrorResponse;
            if (this.error.messsage == null) {
              this.showError(this.error.msgError);
            } else {
              this.showError(this.error.messsage);
            }
          }
        );
      },
    });
  }
  approve(action: string) {
    this.request.id = this.response.id;
    this.request.status = action;
    this.billService.approveBill(this.request).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.showSuccess('phê duyệt thành công');
        this.response.statusCode = action;
        window.location.reload();
      },
      (error) => {
        this.error = error.error as ErrorResponse;
        if (this.error.messsage == null) {
          this.showError(this.error.msgError);
        } else {
          this.showError(this.error.messsage);
        }
      }
    );
  }
  backToProcessing() {
    // Kiểm tra nếu trạng thái hiện tại là "Chờ vận chuyển"
    if (this.response.statusCode === 'W') {
      this.request.id = this.response.id;
      this.request.status = 'RB'; // Sử dụng mã trạng thái "ROLLBACK"
      this.billService.approveBill(this.request).subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<any>;
          this.showSuccess('Đã quay lại trạng thái "Đang xử lý"');
          this.response.statusCode = 'RB';
        },
        (error) => {
          this.error = error.error as ErrorResponse;
          this.showError(this.error.msgError);
        }
      );
    } else {
      this.showError(
        'Chỉ có thể quay lại trạng thái "Đang xử lý" khi đơn hàng ở trạng thái "Chờ vận chuyển".'
      );
    }
  }
}
