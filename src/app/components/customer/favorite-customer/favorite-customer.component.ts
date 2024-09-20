import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { MessageService } from 'primeng/api';
import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { GetProductsResponse } from 'src/app/commons/response/GetProductsResponse';
import { ProductsResponse } from 'src/app/commons/response/ProductsResponse';
import { CommonService } from 'src/app/service/common/common.service';
import { FavoriteService } from 'src/app/service/favorite/favorite.service';

@Component({
  selector: 'app-favorite-customer',
  templateUrl: './favorite-customer.component.html',
  styleUrl: './favorite-customer.component.css',
})
export class FavoriteCustomerComponent implements OnInit {
  response: GetProductsResponse;
  baseResponse: BaseResponse<any>;
  messageResponse: string = '';
  constructor(
    private router: Router,
    private commonService: CommonService,
    private favoriteService: FavoriteService,
    private messageService: MessageService
  ) {
    this.response = new GetProductsResponse();
    this.baseResponse = new BaseResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageNumber = 0;
    this.response.pagination.pageSize = 10;
  }
  ngOnInit(): void {
    this.getProducts();
  }

  goToDetail(productCode: String) {
    this.router.navigate(['/detail-product', productCode]);
  }

  goToPage(page: number) {
    this.response.pagination.pageNumber = page;
    this.getProducts();
  }

  nextPage() {
    if (
      this.response.pagination.pageNumber < this.response.pagination.pageTotal
    ) {
      this.response.pagination.pageNumber++;
    }
    this.getProducts();
  }

  previousPage() {
    if (this.response.pagination.pageNumber > 0) {
      this.response.pagination.pageNumber--;
    }
    this.getProducts();
  }

  getProducts() {
    this.favoriteService
      .getFavorite(
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<any>;
          this.response = this.baseResponse.data;
          if (
            this.response == null ||
            this.response.products == null ||
            this.response.products.length === 0
          ) {
            this.response = new GetProductsResponse();
            this.response.pagination = new PaginationInfo();
            this.response.pagination.pageNumber = 0;
            this.response.pagination.pageSize = 10;
          }
        },
        (error) => {
          this.showError(error.error.message);
        }
      );
  }

  addFavorite(id: Number) {
    this.favoriteService.saveFavorite(id).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.messageResponse = this.baseResponse.data;
        this.showSuccess(this.messageResponse);
        this.getProducts();
      },
      (error) => {
        this.showError(error.error.message);
      }
    );
  }

  deleteFavorite(id: Number) {
    this.favoriteService.deleteFavorite(id).subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.messageResponse = this.baseResponse.data;
        this.showSuccess(this.messageResponse);
        this.getProducts();
      },
      (error) => {
        this.showError(error.error.message);
      }
    );
  }

  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'thực hiện thành công',
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
