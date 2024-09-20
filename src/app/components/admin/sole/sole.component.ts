import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { SoleRequest } from 'src/app/commons/request/SoleRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { SoleResponse } from 'src/app/commons/response/SoleResponse';
import { SolesResponse } from 'src/app/commons/response/SolesResponse';
import { SoleService } from 'src/app/service/sole/sole.service';

@Component({
  selector: 'app-sole',
  templateUrl: './sole.component.html',
  styleUrl: './sole.component.css',
})
export class SoleComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: SolesResponse;
  sole: SoleResponse;
  request: SoleRequest;
  valueSearch: string;
  loading: boolean = false;
  visible: boolean = false;
  selectedStatus!: number;
  nameError!: string;
  error!: ErrorResponse;

  ngOnInit(): void {
    this.titleService.setTitle('Đế giày');
    this.getList();
  }
  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private service: SoleService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new SolesResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.sole = new SoleResponse();
    this.request = new SoleRequest();
    this.valueSearch = '';
  }

  getList() {
    this.loading = true;
    this.request.name = this.valueSearch;
    this.service
      .getList(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe((data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data;
        console.log(this.response.soles);
        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }

  addOrUpdate() {
    if (this.sole.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    this.service.save(this.sole).subscribe(
      (data) => {
        this.visible = false;
        this.showSuccess('Thêm thành công!');
        this.getList();
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
    this.service.update(this.sole).subscribe(
      (data) => {
        this.visible = false;
        // this.getList();
        this.showSuccess('Sửa thành công!');
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

  onStatusChange(brands: SoleResponse) {
    this.service.changStatus(brands).subscribe((data) => {
      this.showSuccess('Sửa thành công!');
      // this.getList();
    });
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getList();
  }

  btnUpdate(select: SoleResponse) {
    this.visible = true;
    this.sole = select;
  }

  btnAdd() {
    this.visible = true;
    this.sole = new SoleResponse();
    this.sole.status = 1;
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
