import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { error } from 'console';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { BrandsRequest } from 'src/app/commons/request/BrandsRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { BrandResponse } from 'src/app/commons/response/BrandResponse';
import { BrandsResponse } from 'src/app/commons/response/BrandsResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { BrandService } from 'src/app/service/brand/brand.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.css',
})
export class BrandComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  response: BrandsResponse;
  brand: BrandResponse;
  request: BrandsRequest;
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
    private brandService: BrandService
  ) {
    this.baseResponse = new BaseResponse<any>();
    this.response = new BrandsResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.brand = new BrandResponse();
    this.request = new BrandsRequest();
    this.valueSearch = '';
  }

  getList() {
    this.loading = true;
    this.request.name = this.valueSearch;
    this.brandService
      .getList(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe((data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.response = this.baseResponse.data;
        console.log(this.response.brands);

        this.loading = false;
      });
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getList();
  }
  addOrUpdate() {
    if (this.brand.id !== undefined) {
      this.update();
    } else {
      this.add();
    }
  }

  add() {
    this.brandService.save(this.brand).subscribe(
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
    this.brandService.update(this.brand).subscribe(
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

    this.brandService.save(this.brand).subscribe(
      (data) => {
        this.visible = false;
        this.showSuccess('Thêm thành công!');
      },
      (error) => {
        if (Array.isArray(error.error)) {
          // Hiển thị từng lỗi
          error.error.forEach((message: string) => {
            this.showError(message);
          });
        } else {
          // Nếu không phải là mảng, hiển thị thông báo lỗi chung
          const errorMessage =
            error.error?.msgError || 'Có lỗi xảy ra, vui lòng thử lại.';
          this.showError(errorMessage);
        }
      }
    );
  }

  onStatusChange(brands: BrandResponse) {
    this.brandService.changStatus(brands).subscribe((data) => {
      this.showSuccess('Thành công!');
      this.getList();
    });
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getList();
  }

  btnUpdate(select: BrandResponse) {
    this.visible = true;
    this.brand = select;
  }

  btnAdd() {
    this.visible = true;
    this.brand = new BrandResponse();
    this.brand.status = 1;
    console.log(this.brand.id);
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
