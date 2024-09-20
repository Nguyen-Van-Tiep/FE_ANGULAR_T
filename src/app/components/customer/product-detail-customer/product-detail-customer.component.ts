import { Component, OnInit } from '@angular/core';
import { ColorResult } from '../../../commons/result/ColorResult';
import { ProductService } from '../../../service/product/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BaseResponse } from '../../../commons/response/BaseResposne';
import { SizeResult } from '../../../commons/result/SizeResult';
import { ShowProductResponse } from '../../../commons/response/ShowProductResponse';
import { ShowProductDetail } from '../../../commons/response/ShowProductDetail';
import { ShowImage } from '../../../commons/response/ShowImage';
import { CartService } from 'src/app/service/cart/cart.service';
import { CartRequest } from 'src/app/commons/request/CartRequest';
import { MessageService } from 'primeng/api';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';

@Component({
  selector: 'app-product-detail-customer',
  templateUrl: './product-detail-customer.component.html',
  styleUrl: './product-detail-customer.component.css',
})
export class ProductDetailCustomerComponent implements OnInit {
  idProduct!: number;
  mainImage: string = '';
  colors: ColorResult[] = [];
  sizes: SizeResult[] = [];
  images: ShowImage[] = [];
  selectedColor!: ColorResult;
  selectedSize!: SizeResult;
  selectedPD: ShowProductDetail;
  baseResponse: BaseResponse<any>;
  response: ShowProductResponse;
  request: CartRequest;
  error: ErrorResponse;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.titleService.setTitle('Giày Sneaker');
    this.baseResponse = new BaseResponse();
    this.response = new ShowProductResponse();
    this.response.productDetailList = [];
    this.request = new CartRequest();
    this.error = new ErrorResponse();
    this.selectedPD = new ShowProductDetail();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idProduct = params['id'];
      this.show(this.idProduct);
    });
  }

  show(idProduct: number) {
    this.productService.getProductByID(idProduct).subscribe((data) => {
      this.baseResponse = data as BaseResponse<any>;
      this.response = this.baseResponse.data;
      console.log('data', this.response);
      //lấy danh sách các màu hiện có
      this.listColor(this.response.productDetailList);
      //chọn màu và size đầu tiên khi mới vào
      this.changeColor(this.colors[0]);
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  listColor(pd: ShowProductDetail[]) {
    pd.forEach((detail) => {
      if (!this.colors.some((color) => color.id === detail.color.id)) {
        this.colors.push(detail.color);
      }
    });
  }

  //lấy danh sách các size khi chọn 1 màu khác
  listSizesByColor(
    pd: ShowProductDetail[],
    selectedColorId: number
  ): SizeResult[] {
    pd.forEach((detail) => {
      if (
        detail.color.id === selectedColorId &&
        !this.sizes.some((size) => size.id === detail.size.id)
      ) {
        this.sizes.push(detail.size);
      }
    });
    return this.sizes;
  }

  //lấy danh sách ảnh khi chọn màu và size khác
  listImageByColorAndSize(
    pd: ShowProductDetail[],
    selectedColorId: number,
    selectedSizeId: number
  ): ShowImage[] {
    pd.forEach((detail) => {
      if (
        detail.color.id === selectedColorId &&
        detail.size.id === selectedSizeId
      ) {
        this.images = detail.imageList;
        this.selectedPD = detail;
      }
    });
    // console.log(this.selectedPD);
    return this.images;
  }

  //Đổi ảnh chính
  changeImage(image: ShowImage) {
    this.mainImage = image.url;
  }

  //Đổi màu khác
  changeColor(color: ColorResult) {
    this.selectedColor = color;
    this.sizes = [];
    this.sizes = this.listSizesByColor(
      this.response.productDetailList,
      this.selectedColor.id
    );
    //chọn size đầu tiên
    if (this.sizes.length > 0) {
      this.selectedSize = this.sizes[0];
    }
    this.images = [];
    this.images = this.listImageByColorAndSize(
      this.response.productDetailList,
      this.selectedColor.id,
      this.selectedSize.id
    );

    // Chọn hình ảnh đầu tiên làm hình ảnh chính
    if (this.images.length > 0) {
      this.changeImage(this.images[0]);
    }
  }

  //Đổi size khác
  changeSize(size: SizeResult) {
    this.selectedSize = size;
    //cập nhật hình ảnh dựa trên size đã chọn
    this.images = this.listImageByColorAndSize(
      this.response.productDetailList,
      this.selectedColor.id,
      this.selectedSize.id
    );
    if (this.images.length > 0) {
      this.changeImage(this.images[0]);
    }
  }

  user: any = {
    username: '',
    role: '',
  };
  addToCart() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
      this.request.username = this.user.username;
      this.request.detailID = this.selectedPD.id;
      console.log(this.user.username);

      console.log(this.request);
      if (this.selectedPD.quantity < 1) {
        this.showError('Sản phẩm này đã hết hàng.');
        return; // Dừng thực hiện nếu sản phẩm hết hàng
      }
      this.cartService.saveCart(this.request).subscribe(
        (data) => {
          this.showSuccess('Đã thêm vào giỏ hàng.');
          // Cập nhật giỏ hàng trong localStorage
          let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
          cartItems.push(this.request); // Giả sử `this.request` là sản phẩm mới thêm vào
          localStorage.setItem('cartItems', JSON.stringify(cartItems));

          // Cập nhật số lượng sản phẩm trong giỏ hàng
          this.updateCartCount();
        },
        (error) => {
          this.error = error.error as ErrorResponse;
          this.showError(this.error.msgError);
        }
      );
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartCount = cartItems.length;
    localStorage.setItem('cartCount', cartCount.toString());
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
  // goToPay() {
  //   this.router.navigate(['/cart']);
  // }
  goToPay(): void {
    const productToPay = {
      productName: this.response.productName,
      price: this.selectedPD.price,
      color: this.selectedColor.name,
      size: this.selectedSize.name,
      quantity: this.selectedPD.quantity,
    };

    // Truyền dữ liệu qua queryParams
    this.router.navigate(['/payment'], {
      queryParams: productToPay,
    });
  }
}
