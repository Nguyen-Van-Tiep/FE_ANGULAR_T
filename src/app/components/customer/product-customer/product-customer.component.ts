import { Component, OnInit } from '@angular/core';
import { BrandResponse } from '../../../commons/response/BrandResponse';
import { StyleResponse } from '../../../commons/response/StyleResponse';
import { ProductsResponse } from '../../../commons/response/ProductsResponse';
import { GetProductRequest } from '../../../commons/request/GetProductRequest';
import { BrandService } from '../../../service/brand/brand.service';
import { StyleService } from '../../../service/style/style.service';
import { MaterialService } from '../../../service/material/material.service';
import { SoleService } from '../../../service/sole/sole.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ProductService } from '../../../service/product/product.service';
import { BaseResponse } from '../../../commons/response/BaseResposne';
import { PaginationInfo } from '../../../commons/info/PaginationInfo';
import { SoleResponse } from '../../../commons/response/SoleResponse';
import { MaterialResponse } from '../../../commons/response/MaterialResponse';
import { ShowProductsResponse } from '../../../commons/response/ShowProductsResponse';
import { ShowProductResponse } from '../../../commons/response/ShowProductResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-customer',
  templateUrl: './product-customer.component.html',
  styleUrl: './product-customer.component.css',
})
export class ProductCustomerComponent implements OnInit {
  //response
  brands!: BrandResponse[];
  selectBrands: BrandResponse[];
  styles!: StyleResponse[];
  selectStyles: StyleResponse[];
  soles!: SoleResponse[];
  selectSoles!: SoleResponse[];
  materials!: MaterialResponse[];
  selectMaterials!: MaterialResponse[];
  response: ShowProductsResponse;
  baseResponse: BaseResponse<any>;
  //request
  request: GetProductRequest;
  //
  min: number = 0;
  max: number = 0;

  constructor(
    private brandService: BrandService,
    private styleService: StyleService,
    private productService: ProductService,
    private materialService: MaterialService,
    private soleService: SoleService,
    private router: Router,
    private messageService: MessageService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Giày Sneaker');
    this.selectBrands = [];
    this.selectStyles = [];
    this.baseResponse = new BaseResponse();
    this.request = new GetProductRequest();
    this.request.brands = [];
    this.request.styles = [];
    this.request.soles = [];
    this.request.materials = [];
    this.response = new ShowProductsResponse();
    this.response.products = [];
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 6;
    this.response.pagination.pageNumber = 0;
    this.response.pagination.pages = [];
  }

  ngOnInit(): void {
    this.getAllStyle();
    this.getAllBrands();
    this.getAllSole();
    this.getAllMaterial();
    this.getProducts();
    this.updatePriceRange();
  }

  getProducts() {
    this.productService
      .getProductsCustomer(
        this.request,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.baseResponse = data as BaseResponse<any>;
          this.response = this.baseResponse.data;
        },
        (error) => {
          console.error('Error searching product:', error);
        }
      );
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

  onSelectBrand(event: any) {
    if (event) {
      this.selectBrands = event as BrandResponse[];
      this.request.brands = this.selectBrands;
    }
    this.response.pagination.pageNumber = 0;
    this.getProducts();
  }

  onSelectStyle(event: any) {
    if (event) {
      this.selectStyles = event as StyleResponse[];
      this.request.styles = this.selectStyles;
    }
    this.response.pagination.pageNumber = 0;
    this.getProducts();
  }

  onSelectSole(event: any) {
    if (event) {
      this.selectSoles = event as StyleResponse[];
      this.request.soles = this.selectSoles;
    }
    this.response.pagination.pageNumber = 0;
    this.getProducts();
  }

  onSelectmaterial(event: any) {
    if (event) {
      this.selectMaterials = event as StyleResponse[];
      this.request.materials = this.selectMaterials;
    }
    this.response.pagination.pageNumber = 0;
    this.getProducts();
  }

  getAllBrands() {
    this.brandService.getAllForC().subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.brands = this.baseResponse.data;
    });
  }

  getAllStyle() {
    this.styleService.getAllForC().subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.styles = this.baseResponse.data;
    });
  }

  getAllSole() {
    this.soleService.getAllForC().subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.soles = this.baseResponse.data;
    });
  }

  getAllMaterial() {
    this.materialService.getAllForC().subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.materials = this.baseResponse.data;
    });
  }

  onChangePrice() {
    if (isNaN(this.min) || isNaN(this.max)) {
      console.log('Giá trị phải là số');
      this.showError('Giá trị phải là số');
      return;
    }

    if (this.min < 0 || this.max < 0) {
      console.log('Giá trị không được âm');
      this.showError('Giá trị không được âm');
      return;
    }

    // Kiểm tra max phải lớn hơn hoặc bằng min
    if (this.max < this.min) {
      console.log('Giá trị max phải lớn hơn hoặc bằng min');
      this.showError('Giá trị max phải lớn hơn hoặc bằng min');
      return;
    }
    if (this.min >= 0 && this.max >= 0 && this.max >= this.min) {
      // Lọc sản phẩm dựa trên khoảng giá
      this.response.products = this.response.products.filter((product) => {
        const productPrices = product.productDetailList.map(
          (detail) => detail.price
        );
        const minProductPrice = Math.min(...productPrices);
        const maxProductPrice = Math.max(...productPrices);
        return (
          (minProductPrice >= this.min && minProductPrice <= this.max) ||
          (maxProductPrice >= this.min && maxProductPrice <= this.max)
        );
      });
    } else {
      console.log('Giá không hợp lệ');
      this.showError('Giá không hợp lệ');
    }
  }

  clear() {
    this.selectBrands = [];
    this.selectMaterials = [];
    this.selectSoles = [];
    this.selectStyles = [];
    this.request.soles = [];
    this.request.brands = [];
    this.request.styles = [];
    this.request.materials = [];
    this.updatePriceRange();
    this.getProducts();
  }

  updatePriceRange() {
    if (this.response.products.length === 0) return;

    // Lấy tất cả các giá sản phẩm
    const allPrices = this.response.products.flatMap((product) =>
      product.productDetailList.map((detail) => detail.price)
    );

    // Cập nhật giá min và max
    this.min = Math.min(...allPrices);
    this.max = Math.max(...allPrices);
    console.log(this.min);
    console.log(this.max);
  }

  goToDetail(id: number) {
    this.router.navigate(['/details', id]);
  }

  addFavorite(id: number) {}

  previousPage() {
    if (this.response.pagination.pageNumber > 0) {
      this.response.pagination.pageNumber--;
    }
    this.getProducts();
  }

  goToPage(page: number) {
    this.response.pagination.pageNumber = page - 1;
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
  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }
}
