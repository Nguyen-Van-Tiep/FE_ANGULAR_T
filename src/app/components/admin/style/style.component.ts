import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { StyleRequest } from 'src/app/commons/request/StyleRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { StyleResponse } from 'src/app/commons/response/StyleResponse';
import { StylesResponse } from 'src/app/commons/response/StylesResponse';
import { StyleService } from 'src/app/service/style/style.service';

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrl: './style.component.css',
})
export class StyleComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: StylesResponse;
  style: StyleResponse;
  request: StyleRequest;
  valueSearch: string;
  loading: boolean = false;
  visible: boolean = false;
  selectedStatus!: number;
  nameError!: string;
  error!: ErrorResponse;

  ngOnInit(): void {
    this.titleService.setTitle('Kiểu dáng');
    this.getList();
  }
  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private service: StyleService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new StylesResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.style = new StyleResponse();
    this.request = new StyleRequest();
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
        console.log(this.response.styles);

        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }
  addOrUpdate() {
    if (this.style.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    this.service.save(this.style).subscribe(
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
    this.service.update(this.style).subscribe(
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

  onStatusChange(styles: StyleResponse) {
    this.service.changStatus(styles).subscribe((data) => {
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

  btnUpdate(select: StyleResponse) {
    this.visible = true;
    this.style = select;
  }

  btnAdd() {
    this.visible = true;
    this.style = new StyleResponse();
    this.style.status = 1;
    console.log(this.style.id);
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
