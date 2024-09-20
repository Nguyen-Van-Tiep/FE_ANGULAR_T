import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { SizeRequest } from 'src/app/commons/request/SizeRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { SizeResponse } from 'src/app/commons/response/SizeResponse';
import { SizesResponse } from 'src/app/commons/response/SizesResponse';
import { SizeService } from 'src/app/service/size/size.service';

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrl: './size.component.css',
})
export class SizeComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: SizesResponse;
  size: SizeResponse;
  request: SizeRequest;
  valueSearch: string;
  loading: boolean = false;
  visible: boolean = false;
  selectedStatus!: number;
  nameError!: string;
  error!: ErrorResponse;

  ngOnInit(): void {
    this.titleService.setTitle('Kích cỡ');
    this.getList();
  }
  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private sizeService: SizeService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new SizesResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.size = new SizeResponse();
    this.request = new SizeRequest();
    this.valueSearch = '';
  }

  getList() {
    this.loading = true;
    this.request.name = this.valueSearch;
    this.sizeService
      .getList(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe((data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data;
        console.log(this.response.sizes);

        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }

  addOrUpdate() {
    if (this.size.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    if (isNaN(this.size.name) || this.size.name <= 0) {
      this.showError('Kích cỡ phải là một số hợp lệ và lớn hơn 0!');
      return;
    }
    this.sizeService.save(this.size).subscribe(
      (data) => {
        this.visible = false;
        this.getList();
        this.showSuccess('Thêm thành công!');
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

  update() {
    if (isNaN(this.size.name) || this.size.name <= 0) {
      this.showError('Kích cỡ phải là một số hợp lệ và lớn hơn 0!');
      return;
    }
    this.sizeService.update(this.size).subscribe(
      (data) => {
        this.visible = false;
        this.showSuccess('Thành công!');
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

  onStatusChange(sizes: SizeResponse) {
    this.sizeService.changStatus(sizes).subscribe((data) => {
      this.showSuccess('Thành công!');
    });
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getList();
  }

  btnUpdate(select: SizeResponse) {
    this.visible = true;
    this.size = select;
  }

  btnAdd() {
    this.visible = true;
    this.size = new SizeResponse();
    this.size.status = 1;
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'chỉnh sửa thành công',
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
}
