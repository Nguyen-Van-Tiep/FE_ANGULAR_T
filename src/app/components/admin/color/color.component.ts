import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { ColorRequest } from 'src/app/commons/request/ColorRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ColorResponse } from 'src/app/commons/response/ColorResponse';
import { ColorsResponse } from 'src/app/commons/response/ColorsResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { ColorService } from 'src/app/service/color/color.service';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrl: './color.component.css',
})
export class ColorComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: ColorsResponse;
  color: ColorResponse;
  request: ColorRequest;
  valueSearch: string;
  loading: boolean = false;
  visible: boolean = false;
  selectedStatus!: number;
  nameError!: string;
  error!: ErrorResponse;

  ngOnInit(): void {
    this.titleService.setTitle('Thương hiệu');
    this.getList();
  }
  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private service: ColorService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new ColorsResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.color = new ColorResponse();
    this.request = new ColorRequest();
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
        console.log(this.response.colors);

        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }

  addOrUpdate() {
    if (this.color.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    if (!this.color || !this.color.name) {
      this.showError('Vui lòng điền tên màu!');
      return;
    }
    if (!this.color || !this.color.code) {
      this.showError('Vui lòng chọn màu!');
      return;
    }
    this.service.save(this.color).subscribe(
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
    this.service.update(this.color).subscribe(
      (data) => {
        this.visible = false;
        this.showSuccess('Thành công!');
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

  onStatusChange(colors: ColorResponse) {
    this.service.changStatus(colors).subscribe((data) => {
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

  btnUpdate(select: ColorResponse) {
    this.visible = true;
    this.color = select;
  }

  btnAdd() {
    this.visible = true;
    this.color = new ColorResponse();
    this.color.status = 1;
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
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }
}
