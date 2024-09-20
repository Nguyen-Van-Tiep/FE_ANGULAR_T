import { Component, OnInit } from '@angular/core';
import { ProductsResponse } from '../../../commons/response/ProductsResponse';
import { ProductsRequest } from '../../../commons/request/ProductsRequest';
import { BaseResponse } from '../../../commons/response/BaseResposne';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductService } from '../../../service/product/product.service';
import { PaginationInfo } from '../../../commons/info/PaginationInfo';
import { ProductResult } from '../../../commons/result/ProductResult';
import { MessageService } from 'primeng/api';
import { BrandResponse } from 'src/app/commons/response/BrandResponse';
import { StyleResponse } from 'src/app/commons/response/StyleResponse';
import { MaterialResponse } from 'src/app/commons/response/MaterialResponse';
import { SoleResponse } from 'src/app/commons/response/SoleResponse';
import { BrandService } from 'src/app/service/brand/brand.service';
import { MaterialService } from 'src/app/service/material/material.service';
import { SoleService } from 'src/app/service/sole/sole.service';
import { StyleService } from 'src/app/service/style/style.service';
import { error } from 'console';

@Component({
  selector: 'admin-product',
  templateUrl: './admin-product.component.html',
  styleUrl: './admin-product.component.css',
})
export class AdminProductComponent implements OnInit {
  response: ProductsResponse;
  loading: boolean = false;
  isVisible: boolean = false;
  number: number = 0;
  productRequest: ProductsRequest;
  productResponse: BaseResponse<any>;
  valueSearch: string;
  selectedStatus!: number;
  visible !: boolean;
  product: ProductResult;
  brandsResponse!: BaseResponse<BrandResponse[]>;
  brands!: BrandResponse[];
  //
  styles!: StyleResponse[];
  stylesResponse!: BaseResponse<StyleResponse[]>;
  //
  materials!: MaterialResponse[];
  materialsResponse!: BaseResponse<MaterialResponse[]>;
  //
  soles!: SoleResponse[];
  solesResponse!: BaseResponse<SoleResponse[]>;
  //validate
  productNameError: string | null = null;
  descriptionError: string | null = null;
  selectedBrandError: string | null = null;
  selectedStyleError: string | null = null;
  selectedMaterialError: string | null = null;
  selectedSoleError: string | null = null;
  isValid: Boolean = true;

  constructor(
    private router: Router,
    private titleService: Title,
    private messageService: MessageService,
    private productService: ProductService,
    private brandService: BrandService,
    private materialService: MaterialService,
    private soleService: SoleService,
    private styleService: StyleService,
  ) {
    this.productRequest = new ProductsRequest();
    this.productResponse = new BaseResponse<any>();
    this.valueSearch = '';
    this.response = new ProductsResponse();
    this.response.pagination = new PaginationInfo();
    this.response.pagination.pageSize = 3;
    this.response.pagination.pageNumber = 0;
    this.visible = false;
    this.product = new ProductResult();
  }

  ngOnInit(): void {
    this.titleService.setTitle('Sản phẩm');
    this.getAllBrands();
    this.getAllMaterial();
    this.getAllSole();
    this.getAllStyle();
    this.getProducts();
  }

  onSearch() {
    this.response.pagination.pageNumber = 0;
    this.getProducts();
  }

  addProduct() {
    this.router.navigate(['/admin/add-product']);
  }

  getProducts() {
    this.number = 0;
    this.loading = true;
    this.productRequest.name = this.valueSearch;
    this.productRequest.status = this.selectedStatus;
    this.productService
      .getProducts(
        this.productRequest,
        this.response.pagination.pageNumber,
        this.response.pagination.pageSize
      )
      .subscribe(
        (data) => {
          this.productResponse = data as BaseResponse<any>;
          this.response = this.productResponse.data;
          this.loading = false;
        },
        (error) => {
          console.error('Error searching product:', error);
          this.loading = false;
        }
      );
  }

  onStatusChange(product: ProductResult) {
    this.productService.changerStatus(product).subscribe((data) => {
      this.getProducts();
    });
  }

  paginate(event: any) {
    const page = event.first! / event.rows!;
    const size = event.rows!;
    this.response.pagination.pageSize = size;
    this.response.pagination.pageNumber = page;
    this.getProducts();
  }

  goToDetails(proId: number) {
    this.router.navigate(['/admin/manager-product', proId])
  }

  validateForm() {
    this.isValid = true;
    this.validateProductName(this.product.productName);
    this.validateDescription(this.product.description);
    this.validateSelectBrand(this.product.brand);
    this.validateSelectMaterial(this.product.material);
    this.validateSelectSole(this.product.sole);
    this.validateSelectStyle(this.product.style);
  }

  validateProductName(productName: string) {
    if (!productName || productName.trim().length === 0) {
      this.productNameError = 'Tên sản phẩm không được để trống';
      this.isValid = false;
    } else {
      this.productNameError = '';
    }
  }

  validateDescription(description: string) {
    if (!description || description.trim().length === 0) {
      this.descriptionError = 'Mô tả không được để trống';
      this.isValid = false;
    } else {
      this.descriptionError = '';
    }
  }

  validateSelectBrand(brand: BrandResponse | null | undefined) {
    if (!brand) {
      this.selectedBrandError = 'Chưa chọn thương hiệu';
      this.isValid = false;
    } else {
      this.selectedBrandError = '';
    }
  }

  validateSelectStyle(style: StyleResponse | null | undefined) {
    if (!style) {
      this.selectedStyleError = 'Chưa chọn danh mục';
      this.isValid = false;
    } else {
      this.selectedStyleError = '';
    }
  }

  validateSelectSole(sole: SoleResponse | null | undefined) {
    if (!sole) {
      this.selectedSoleError = 'Chưa chọn đế';
      this.isValid = false;
    } else {
      this.selectedSoleError = '';
    }
  }

  validateSelectMaterial(material: MaterialResponse | null | undefined) {
    if (!material) {
      this.selectedMaterialError = 'Chưa chọn chất liệu';
      this.isValid = false;
    } else {
      this.selectedMaterialError = '';
    }
  }
  //UPDATE SAN PHAM
  update() {
    this.validateForm();
    if (!this.isValid) {
      return;
    }
    console.log(this.product);
    this.productService.updateProduct(this.product).subscribe(data=>{
      this.showSuccess('Sửa thành công')
      this.visible = false
      this.getProducts();
    },(error)=>{
      this.showError(error.error.msgError)
      this.visible = false
    })
  }

  btnUpdate(id: number) {
    this.visible = true;
    this.productService.getProductByID(id).subscribe((data) => {
      this.productResponse = data as BaseResponse<any>
      this.product = this.productResponse.data;
    })
  }

  getAllBrands() {
    this.brandService.getAllBrand().subscribe((data) => {
      this.brandsResponse = data as BaseResponse<BrandResponse[]>;
      this.brands = this.brandsResponse.data;
    });
  }

  getAllStyle() {
    this.styleService.getAllStyle().subscribe((data) => {
      this.stylesResponse = data as BaseResponse<StyleResponse[]>;
      this.styles = this.stylesResponse.data;
    });
  }

  getAllSole() {
    this.soleService.getAllSole().subscribe((data) => {
      this.solesResponse = data as BaseResponse<SoleResponse[]>;
      this.soles = this.solesResponse.data;
    });
  }

  getAllMaterial() {
    this.materialService.getAllMaterial().subscribe((data) => {
      this.materialsResponse = data as BaseResponse<MaterialResponse[]>;
      this.materials = this.materialsResponse.data;
    });
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
