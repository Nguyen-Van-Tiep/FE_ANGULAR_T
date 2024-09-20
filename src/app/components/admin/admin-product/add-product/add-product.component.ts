import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../service/product/product.service';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { BrandService } from '../../../../service/brand/brand.service';
import { BrandResponse } from '../../../../commons/response/BrandResponse';
import { BaseResponse } from '../../../../commons/response/BaseResposne';
import { MessageService } from 'primeng/api';
import { SizeResult } from '../../../../commons/result/SizeResult';
import { ColorResult } from '../../../../commons/result/ColorResult';
import { ColorService } from '../../../../service/color/color.service';
import { SizeService } from '../../../../service/size/size.service';

import { StyleResponse } from '../../../../commons/response/StyleResponse';

import { SoleResponse } from '../../../../commons/response/SoleResponse';
import { MaterialService } from '../../../../service/material/material.service';
import { SoleService } from '../../../../service/sole/sole.service';
import { StyleService } from '../../../../service/style/style.service';
import { ImageResult } from '../../../../commons/result/ImageResult';
import { AddProductRequest } from 'src/app/commons/request/AddProductRequest';
import { ProductResponseAdd } from 'src/app/commons/response/ProductResponseAdd';
import { MaterialResponse } from 'src/app/commons/response/MaterialResponse';
import { ProductDetail } from 'src/app/commons/result/ProductDetail';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
})
export class AddProductComponent implements OnInit {
  product: AddProductRequest;
  productsResponse!: BaseResponse<ProductResponseAdd>;
  productResponse!: ProductResponseAdd;
  error!: ErrorResponse;
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
  //
  colosResponse!: BaseResponse<ColorResult[]>;
  sizesResponse!: BaseResponse<SizeResult[]>;
  sizes!: SizeResult[];
  colors!: ColorResult[];
  selectedSizes: SizeResult[] = [];
  selectedColors: ColorResult[] = [];
  //
  productDetails: ProductDetail[] = [];
  //
  imageResult: ImageResult[] = []; //Hiển thị lên

  isDisableClear: boolean = true;
  //validate
  productNameError: string | null = null;
  descriptionError: string | null = null;
  selectedBrandError: string | null = null;
  selectedStyleError: string | null = null;
  selectedMaterialError: string | null = null;
  selectedSoleError: string | null = null;
  isValid: Boolean = true;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private materialService: MaterialService,
    private soleService: SoleService,
    private styleService: StyleService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private messageService: MessageService,
    private router: Router,
    private titleService: Title,
    private sanitizer: DomSanitizer
  ) {
    this.titleService.setTitle('Thêm sản phẩm');
    this.product = {
      id: 0,
      productName: '',
      brand: null,
      style: null,
      material: null,
      sole: null,
      description: '',
      createdBy: '',
      createdDate: '',
      modifiedBy: '',
      modifiedDate: '',
      status: 1,
      productDetails: [],
    };
  }

  ngOnInit(): void {
    this.getAllStyle();
    this.getAllBrands();
    this.getAllSole();
    this.getAllMaterial();
    this.getAllColor();
    this.getAllSize();
  }
  test() {
    this.product.productDetails = this.productDetails.map((detail) => ({
      ...detail,
      images: detail.images.map((img) => ({ name: img.name })), // Chỉ giữ tên ảnh
    }));
    console.log(this.product);
  }

  saveProduct() {
    this.product.status = 1;
    this.validateForm();
    if (!this.isValid) {
      return;
    }
    this.product.productDetails = this.productDetails.map((detail) => ({
      ...detail,
      images: detail.images.map((img) => ({ name: img.name })), // Chỉ giữ tên ảnh
    }));
    this.productService.postProd(this.product).subscribe(
      (data) => {
        this.productsResponse = data as BaseResponse<ProductResponseAdd>;
        console.log('productsResponse', this.productsResponse);
        this.productResponse = this.productsResponse.data;
        this.router.navigate(['/admin/products']);
        setTimeout(() => {
          this.showSuccess('Thêm thành công!');
        }, 1000);
      },
      (error) => {
        // this.error = error.error as ErrorResponse;
        // this.showError(this.error.msgError);
        if (error.error && error.error.message) {
          this.showError(error.error.message);
        } else {
          this.showError('Có lỗi xảy ra, vui lòng thử lại.');
        }
      }
    );
  }

  validateForm() {
    this.isValid = true;
    this.validateProductName(this.product.productName);
    this.validateDescription(this.product.description);
    this.validateSelectBrand(this.product.brand);
    this.validateSelectMaterial(this.product.material);
    this.validateSelectSole(this.product.sole);
    this.validateSelectStyle(this.product.style);
    this.validateSelectedSizes(this.selectedSizes);
    this.validateSelectedColors(this.selectedColors);
  }
  validateSelectedSizes(selectedSizes: SizeResult[]) {
    if (selectedSizes.length === 0) {
      this.showError('Phải chọn ít nhất một kích cỡ');
      this.isValid = false;
    } else {
      this.productNameError = '';
    }
  }

  validateSelectedColors(selectedColors: ColorResult[]) {
    if (selectedColors.length === 0) {
      this.showError('Phải chọn ít nhất một màu sắc');
      this.isValid = false;
    } else {
      this.descriptionError = '';
    }
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

  onSelectedFiles(event: any, color: ColorResult) {
    // const filesTemp = event.currentFiles;
    // const productIndex = this.product.productDetails.indexOf(productDT);
    // if (filesTemp && filesTemp.length > 0) {
    //   // Xóa các tệp cũ liên quan đến sản phẩm
    //   for (let i = 0; i < filesTemp.length; i++) {
    //     const file = filesTemp[i];
    //     const objectURL = URL.createObjectURL(file);
    //     this.imageResult.push({ id: 0 - this.imageResult.length - 1, url: objectURL, name: file.name, indexPD: productIndex })
    //     productDT.images.push({  name: file.name })
    //   }
    // }
    // this.isDisableClear = false;
  }

  groupedProductDetails: { color: ColorResult; variants: ProductDetail[] }[] =
    [];

  generateVariants() {
    this.productDetails = [];
    for (let color of this.selectedColors) {
      for (let size of this.selectedSizes) {
        if (size && color) {
          this.productDetails.push({
            id: -1,
            size,
            color,
            quantity: 0,
            price: 0,
            description: '',
            status: 1,
            images: [],
          });
        }
      }
    }

    // Nhóm các biến thể theo màu
    this.groupedProductDetails = this.selectedColors.map((color) => ({
      color,
      variants: this.productDetails.filter((pd) => pd.color.id === color.id),
    }));
  }

  chooseFiles(event: any, color: ColorResult) {
    if (event.target.files && event.target.files.length > 0) {
      const maxFiles = 4;
      const filesToAdd = event.target.files;

      const currentImageCount = this.imageResult.filter(
        (image) => image.colorId === color.id
      ).length;

      if (currentImageCount + filesToAdd.length > maxFiles) {
        alert(`Bạn chỉ có thể chọn tối đa ${maxFiles} ảnh cho màu này.`);
        return;
      }

      for (let i = 0; i < filesToAdd.length; i++) {
        const file = filesToAdd[i];
        const fileName = file.name;

        if (
          !this.imageResult.some(
            (image) => image.name === fileName && image.colorId === color.id
          )
        ) {
          const objectURL = URL.createObjectURL(file);
          this.imageResult.push({
            id: this.imageResult.length - 1,
            url: objectURL,
            name: fileName,
            colorId: color.id,
          });

          this.productDetails
            .filter((pd) => pd.color.id === color.id)
            .forEach((pd) => pd.images.push({ name: fileName }));
        }
      }
    }
    this.isDisableClear = false;
  }

  onRemoveFile(color: ColorResult) {
    this.imageResult = this.imageResult.filter(
      (image) => image.colorId !== color.id
    );
    this.productDetails
      .filter((pd) => pd.color.id === color.id)
      .forEach((pd) => (pd.images = []));
    this.isDisableClear = true;
  }

  removeImages(color: ColorResult, name: string) {
    this.productDetails
      .filter((pd) => pd.color.id === color.id)
      .forEach(
        (pd) => (pd.images = pd.images.filter((img) => img.name !== name))
      );
    this.imageResult = this.imageResult.filter(
      (image) => image.name !== name || image.colorId !== color.id
    );
  }

  getImagesForColor(color: ColorResult) {
    return this.imageResult.filter((image) => image.colorId === color.id);
  }

  // getImagesForProductDetail(detail: ProductDetail) {
  //   const detailIndex = this.product.productDetails.indexOf(detail);
  //   return this.imageResult.filter((image) => image.indexPD === detailIndex);
  // }

  onSizeChange(event: any) {
    const sizeID = event.target.value;
    // Tìm đối tượng kích cỡ tương ứng với sizeID
    const size = this.sizes.find((s) => s.id === +sizeID);
    if (size) {
      // Nếu size không phải là undefined
      if (event.target.checked) {
        if (!this.selectedSizes.includes(size)) {
          this.selectedSizes.push(size);
        }
      } else {
        const index = this.selectedSizes.indexOf(size);
        if (index > -1) {
          this.selectedSizes.splice(index, 1);
        }
      }
    } else {
      console.error('Size not found:', sizeID);
    }
  }

  onColorChange(event: any) {
    const colorID = event.target.value;
    const color = this.colors.find((c) => c.id === +colorID);
    if (color) {
      // Xử lý nếu color không phải là undefined
      if (event.target.checked) {
        if (!this.selectedColors.includes(color)) {
          this.selectedColors.push(color);
        }
      } else {
        const index = this.selectedColors.indexOf(color);
        if (index > -1) {
          this.selectedColors.splice(index, 1);
        }
      }
    } else {
      console.error('Color not found:', colorID);
    }
  }

  goBack() {
    this.router.navigate(['/admin/products']);
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

  getAllColor() {
    this.colorService.getAllColor().subscribe((data) => {
      this.colosResponse = data as BaseResponse<ColorResult[]>;
      this.colors = this.colosResponse.data;
    });
  }

  getAllSize() {
    this.sizeService.getAllSize().subscribe((data) => {
      this.sizesResponse = data as BaseResponse<SizeResult[]>;
      this.sizes = this.sizesResponse.data;
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
