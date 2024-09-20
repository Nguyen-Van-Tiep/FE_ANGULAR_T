import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetProductRequest } from 'src/app/commons/request/GetProductRequest';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
import { Product } from 'src/app/commons/dto/Product';
import { RevenueByMonth } from 'src/app/commons/dto/RevenueByMonth';
import { RevenueByYear } from 'src/app/commons/dto/RevenueByYear';
import { RevenueData } from 'src/app/commons/dto/RevenueData';
import { ProductDTO } from 'src/app/commons/dto/ProductDTO';
import { AddProductRequest } from 'src/app/commons/request/AddProductRequest';
import { ProductResult } from 'src/app/commons/result/ProductResult';
import { ProductsRequest } from 'src/app/commons/request/ProductsRequest';
import { Observable } from 'rxjs';
import { ShowProductResponse } from 'src/app/commons/response/ShowProductResponse';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
const BASE_API = env.baseApi;

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  api = BASE_API + 'product';
  api2 = BASE_API + 'dash-board';
  private id!: number;
  constructor(private http: HttpClient, private commonService: CommonService) {}
  token: string | null = localStorage.getItem('token')?.trim() || '';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ` + this.token!,
      'Access-Control-Allow-Origin': 'http://localhost:8080/',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }),
  };

  getTopSellingProductsByDay() {
    return this.http.get<ProductDTO[]>(
      `${this.api2}/top-selling-products/today`
    );
  }

  getTopSellingProductsByWeek(startDate: string, endDate: string) {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ProductDTO[]>(
      this.api2 +
        '/top-selling-products/this-week?startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  }

  getTopSellingProductsByMonth() {
    return this.http.get<ProductDTO[]>(
      `${this.api2}/top-selling-products/this-month`
    );
  }

  getTopSellingProductsByYear() {
    return this.http.get<ProductDTO[]>(
      `${this.api2}/top-selling-products/this-year`
    );
  }

  getFilteredProducts(filters: any) {
    let params = new HttpParams();

    if (filters.date) params = params.set('date', filters.date);
    if (filters.week) params = params.set('week', filters.week.toString());
    if (filters.month) params = params.set('month', filters.month.toString());
    if (filters.year) params = params.set('year', filters.year.toString());

    return this.http.get<Product[]>(`${this.api}/filter`, {
      params: params,
    });
  }
  getFilteredStatistics(productName: string, month: number) {
    const params = new HttpParams()
      .set('productName', productName || '')
      .set('month', month?.toString() || '');

    return this.http.get<Product[]>(
      this.api +
        '/filtered-statistics?productName=' +
        productName +
        '&month=' +
        month,
      this.commonService.gethttpOptions()
    );
  }

  exportBestSellingProducts(currentMonth: number) {
    return this.http.get(
      this.api + '/export-best-selling?currentMonth=' + currentMonth,
      {
        responseType: 'blob',
      }
    );
  }
  getMonthlyRevenue() {
    return this.http.get<RevenueData[]>(
      this.api + '/monthly-revenue',
      this.commonService.gethttpOptions()
    );
  }

  getBestSellingProducts(currentMonth: number) {
    return this.http.get<Product[]>(
      this.api + '/best-selling-products?currentMonth=' + currentMonth,
      this.commonService.gethttpOptions()
    );
  }
  getTop10Products() {
    return this.http.get<Product[]>(
      this.api + '/top10',
      this.commonService.gethttpOptions()
    );
  }
  getStatistical() {
    return this.http.get<Product[]>(
      this.api + '/statistical/all',
      this.commonService.gethttpOptions()
    );
  }
  getStatistical2() {
    return this.http.get<RevenueByMonth[]>(
      this.api + '/statistical/month-year',
      this.commonService.gethttpOptions()
    );
  }
  getStatistical3() {
    return this.http.get<RevenueByYear[]>(
      this.api + '/statistical/year',
      this.commonService.gethttpOptions()
    );
  }
  getProducts(request: ProductsRequest, page: number, size: number) {
    return this.http.post(
      this.api + '/get-product?page=' + page + '&size=' + size,
      request,
      this.httpOptions
    );
  }

  postProd(product: AddProductRequest) {
    return this.http.post(this.api + '/add-product', product, this.httpOptions);
  }

  changerStatus(product: ProductResult) {
    return this.http.put(
      this.api + '/change-status/' + product.id,
      product,
      this.httpOptions
    );
  }

  getProductsCustomer(request: GetProductRequest, page: number, size: number) {
    return this.http.post(
      this.api + '/show?page=' + page + '&size=' + size,
      request,
      this.httpOptions
    );
  }

  getTop4Newest() {
    return this.http.get(
      'http://localhost:8080/api/v1.0/product/findTop4New',
      this.httpOptions
    );
  }

  getProductByID(id: number) {
    return this.http.get(
      'http://localhost:8080/api/v1.0/product/product/' + id
    );
  }

  updateProduct(product : ProductResult){
    return this.http.put(this.api+'/update',product,this.httpOptions);
  }

  // setSelectedData(id: number) {
  //   this.id = id;
  // }

  // getSelectedData() {
  //   return this.id;
  // }
  getTopSellingProductsByCustomRange(
    startDate: string,
    endDate: string
  ): Observable<ProductDTO[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<ProductDTO[]>(
      this.api2 +
        '/top-selling-products/custom-range?startDate=' +
        startDate +
        '&endDate=' +
        endDate
    );
  }
  getTop4BestSellingProducts() {
    return this.http.get(this.api + '/top4-selling-products', this.httpOptions);
  }
}
