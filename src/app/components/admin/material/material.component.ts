import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { MaterialRequest } from 'src/app/commons/request/MaterialRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { MaterialResponse } from 'src/app/commons/response/MaterialResponse';
import { MaterialsResponse } from 'src/app/commons/response/MaterialsResponse';
import { MaterialService } from 'src/app/service/material/material.service';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrl: './material.component.css',
})
export class MaterialComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: MaterialsResponse;
  material: MaterialResponse;
  request: MaterialRequest;
  valueSearch: string;
  loading: boolean = false;
  visible: boolean = false;
  selectedStatus!: number;
  nameError!: string;
  error!: ErrorResponse;

  ngOnInit(): void {
    this.titleService.setTitle('Chất liệu');
    this.getList();
  }
  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private materialService: MaterialService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new MaterialsResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.material = new MaterialResponse();
    this.request = new MaterialRequest();
    this.valueSearch = '';
  }

  getList() {
    this.loading = true;
    this.request.name = this.valueSearch;
    this.materialService
      .getList(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe((data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data;
        console.log(this.response.materials);

        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }
  addOrUpdate() {
    if (this.material.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    this.materialService.save(this.material).subscribe(
      (data) => {
        this.visible = false;
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
    this.materialService.update(this.material).subscribe(
      (data) => {
        this.visible = false;
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

  onStatusChange(brands: MaterialResponse) {
    this.materialService.changStatus(brands).subscribe((data) => {
      this.showSuccess('Sửa thành công!');
    });
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getList();
  }

  btnUpdate(select: MaterialResponse) {
    this.visible = true;
    this.material = select;
  }

  btnAdd() {
    this.visible = true;
    this.material = new MaterialResponse();
    this.material.status = 1;
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
