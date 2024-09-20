import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { DetailOrderResponse } from 'src/app/commons/response/DetailOrderResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { BillService } from 'src/app/service/bill/bill.service';
@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css',
})
export class DetailOrderComponent {
  code: string;
  response: DetailOrderResponse;
  baseResponse: BaseResponse<any>;
  error: ErrorResponse;
  isDone: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private billService: BillService,
    private messageService: MessageService
  ) {
    this.baseResponse = new BaseResponse();
    this.error = new ErrorResponse();
    this.response = new DetailOrderResponse();
    this.code = this.route.snapshot.params['code'];
  }

  ngOnInit(): void {
    this.billService.detailBillCustomer(this.code).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data as DetailOrderResponse;
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
}
