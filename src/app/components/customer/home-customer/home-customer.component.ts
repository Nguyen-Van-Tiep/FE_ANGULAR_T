import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product/product.service';
import { Title } from '@angular/platform-browser';
import { BaseResponse } from '../../../commons/response/BaseResposne';
import { ShowProductsResponse } from '../../../commons/response/ShowProductsResponse';
import { ShowProductResponse } from '../../../commons/response/ShowProductResponse';
import { PaginationInfo } from '../../../commons/info/PaginationInfo';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrl: './home-customer.component.css',
})
export class HomeCustomerComponent implements OnInit {
  //response
  baseResponse: BaseResponse<any>;
  responseNewest: ShowProductsResponse;
  responseBestSeller: ShowProductsResponse;
  topProducts: ShowProductsResponse = new ShowProductsResponse();
  constructor(
    private router: Router,
    private productService: ProductService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Trang chủ');
    this.baseResponse = new BaseResponse();
    this.responseNewest = new ShowProductsResponse();
    this.responseNewest.products = [];
    this.responseNewest.pagination = new PaginationInfo();
    this.responseBestSeller = new ShowProductsResponse();
    this.responseBestSeller.products = [];
    this.responseBestSeller.pagination = new PaginationInfo();
  }
  ngOnInit(): void {
    this.getTop3Newest();
    this.getTop4BestSellingProducts();
  }
  getTop4BestSellingProducts(): void {
    this.productService.getTop4BestSellingProducts().subscribe(
      (data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.topProducts.products = this.baseResponse.data;
        console.log('bán chạy', this.topProducts);
      },
      (error) => {
        console.error('Error fetching top selling products', error);
      }
    );
  }
  getTop3Newest() {
    this.productService.getTop4Newest().subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.responseNewest.products = this.baseResponse.data;
    });
  }

  getMinMaxPrice(product: ShowProductResponse): {
    minPrice: number;
    maxPrice: number;
  } {
    const prices = product.productDetailList.map((detail) => detail.price);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { minPrice, maxPrice };
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/details', id]);
  }

  addFavorite(id: number) {}

  showMore() {
    this.router.navigate(['/products']);
  }
}
