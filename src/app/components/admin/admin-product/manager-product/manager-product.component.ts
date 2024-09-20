import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponse } from '../../../../commons/response/BaseResposne';
import { ProductService } from '../../../../service/product/product.service';
import { PaginationInfo } from '../../../../commons/info/PaginationInfo';

import { ProductDetailsResponse } from '../../../../commons/response/ProductDetailsResponse';

import { ProductdetailService } from '../../../../service/productdetail/productdetail.service';
import { ProductDetailResponse } from '../../../../commons/response/ProductDetailResponse';
import { MessageService } from 'primeng/api';
import { ProductDetail } from 'src/app/commons/result/ProductDetail';
import { ProductDetailRequest } from 'src/app/commons/request/ProductDetailRequest';
import { DetailResponse } from 'src/app/commons/response/DetailResponse';
import { error } from 'console';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';

@Component({
  selector: 'app-manager-product',
  templateUrl: './manager-product.component.html',
  styleUrl: './manager-product.component.css',
})
export class ManagerProductComponent implements OnInit {
  idProduct!: number;
  loading: boolean = false;
  visible: boolean = false;
  number: number = 0;
  productDetail: ProductDetail;
  response: ProductDetailsResponse;
  productDetailResponse: BaseResponse<any>;
  productDetailsRequest: ProductDetailRequest;
  productDetails: ProductDetailResponse[] = [];
  //
  detailResponse: DetailResponse;
  selectedStatus!: number;
  //validate
  quantityError: string | null = null;
  priceError: string | null = null;
  regexPattern = /^[0-9]*$/;
  checked: Boolean = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private productDetailService: ProductdetailService
  ) {
    this.productDetail = new ProductDetail();
    this.detailResponse = new DetailResponse();
    this.detailResponse.images = [];
    this.detailResponse.productDetail = new ProductDetailResponse();
    this.productDetailsRequest = new ProductDetailRequest();
    this.productDetailResponse = new BaseResponse<any>();
    this.response = new ProductDetailsResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Chi Tiết Sản phẩm');
    this.route.params.subscribe((params) => {
      this.idProduct = params['id'];
      this.getProductDetails();
    });
  }

  updateProductDetail() {
    this.validateForm();
    if (!this.checked) {
      return;
    }
    return this.productDetailService
      .updatePD(this.idProduct, this.detailResponse.productDetail)
      .subscribe(
        (data) => {
          this.visible = false;
          this.getProductDetails();
          setTimeout(() => {
            this.showSuccess('Sửa thành công!');
          }, 1000);
        },
        (error) => {
          if (error.error && typeof error.error === 'object') {
            // Nếu lỗi là đối tượng, lấy thông điệp lỗi
            const errorMessage =
              error.error.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            this.showError(errorMessage);
          } else if (Array.isArray(error.error)) {
            // Nếu lỗi là mảng, hiển thị từng lỗi
            error.error.forEach((message: string) => {
              this.showError(message);
            });
          } else {
            // Nếu không phải là mảng hay đối tượng, hiển thị thông báo lỗi chung
            this.showError('Có lỗi xảy ra, vui lòng thử lại.');
          }
        }
      );
  }

  validateForm() {
    this.checked = true;
    this.validatePrice(this.detailResponse.productDetail.price);
    this.validateQuantity(this.detailResponse.productDetail.quantity);
  }

  validatePrice(price: string) {
    if (!price || !this.regexPattern.test(price)) {
      this.priceError = 'Nhập lại đơn giá';
      this.checked = false;
    } else {
      this.priceError = '';
    }
  }

  validateQuantity(quantity: string) {
    if (!quantity || !this.regexPattern.test(quantity)) {
      this.quantityError = 'Nhập lại số lượng';
      this.checked = false;
    } else {
      this.quantityError = '';
    }
  }
  getProductDetails() {
    this.number = 0;
    this.loading = true;
    this.productDetailsRequest.proID = this.idProduct;
    this.productDetailService
      .getProductDetails(
        this.productDetailsRequest,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.productDetailResponse = data as BaseResponse<any>;
          this.response = this.productDetailResponse.data;
          console.log(this.response.productDetails);
          this.loading = false;
        },
        (error) => {
          console.error('Error searching product detail:', error);
          this.loading = false;
        }
      );
  }

  getProDetail(pdID: number) {
    // this,
    this.productDetailService.getProductDetail(pdID).subscribe((data) => {
      this.productDetailResponse = data as BaseResponse<any>;
      this.detailResponse = this.productDetailResponse.data;
      console.log(this.detailResponse);
    });
  }

  onStatusChange(pd: number) {
    console.log(pd);
    this.productDetailService.changStatus(pd).subscribe(
      (data) => {},
      (error) => {
        let errorMessage = 'Đã có lỗi xảy ra, vui lòng thử lại.';
        const errorResponse = JSON.parse(error.error.msgError) as {
          code?: string;
          name?: string;
        };
        const codeMessage = errorResponse.code || '';
        const nameMessage = errorResponse.name || '';
        errorMessage = `${nameMessage}.   ${codeMessage}`.trim();
        this.showError(errorMessage);
      }
    );
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getProductDetails();
  }

  showDialog(pdID: number) {
    this.visible = true;
    this.getProDetail(pdID);
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
