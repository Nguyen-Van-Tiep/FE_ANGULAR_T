import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CartItemRequest } from 'src/app/commons/request/CartItemRequest';
import { CartRequest } from 'src/app/commons/request/CartRequest';
import { PaymentRequest } from 'src/app/commons/request/PaymentRequest';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { CartItemResponse } from 'src/app/commons/response/CartItemResponse';
import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
import { PaymentResponse } from 'src/app/commons/response/PaymentResponse';
import { CartResult } from 'src/app/commons/result/CartResult';
import { CartService } from 'src/app/service/cart/cart.service';
import { PaymentService } from 'src/app/service/payment/payment.service';
import { ProductService } from 'src/app/service/product/product.service';
import { TokenStorageService } from 'src/app/service/tokenStorage/token-storage.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent implements OnInit {
  baseResponse: BaseResponse<any>;
  cartResponse: CartItemResponse[];
  selectedProductPDId!: number[];
  request: CartRequest;
  visible: boolean = false;
  selectAll: boolean = false;
  selectedCartItems: CartItemResponse[] = [];
  cartItem: CartItemRequest;
  paymentRequest: PaymentRequest;
  paymentResponse = new PaymentResponse();
  error = new ErrorResponse();
  username: string = '';
  selectedProduct: CartResult[];
  isDisable!: boolean;
  constructor(
    private confirmationService: ConfirmationService,
    private cartService: CartService,
    private messageService: MessageService,
    private productService: ProductService,
    private paymentService: PaymentService,
    private router: Router,
    private titleService: Title,
    private route: ActivatedRoute,
    private tokenStorageService: TokenStorageService
  ) {
    this.titleService.setTitle('Giỏ hàng');
    this.baseResponse = new BaseResponse();
    this.selectedProduct = [];
    this.request = new CartRequest();
    this.cartResponse = [];
    this.selectedCartItems = [];
    this.cartItem = new CartItemResponse();
    this.paymentRequest = new PaymentRequest();
    this.paymentRequest.cartIds = [];
  }

  ngOnInit(): void {
    this.loadCartItems();
    // this.loadProducts();
  }

  user: any = {
    username: '',
    role: '',
  };

  loadCartItems() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.user = JSON.parse(userInfo);
      this.request.username = this.user.username;
      this.request.detailID = 0;
      // console.log(this.request);
      this.cartService.getCart(this.request).subscribe((data) => {
        this.baseResponse = data as BaseResponse<any>;
        this.cartResponse = this.baseResponse.data;
        localStorage.setItem(
          'totalUniqueItems',
          this.totalUniqueItems.toString()
        );
        // console.log(this.baseResponse);
      });
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
  }

  toggleSelectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.cartResponse.forEach((item) => {
      const checkbox = document.querySelector(
        `input[name="item${item.id}"]`
      ) as HTMLInputElement;
      if (checkbox) {
        checkbox.checked = isChecked;
        if (isChecked) {
          this.addToSelectedItems(item);
        } else {
          this.removeFromSelectedItems(item);
        }
      }
    });
    console.log(this.selectedCartItems);
  }

  handleCheckboxChange(item: CartItemResponse) {
    const checkbox = document.querySelector(
      `input[name="item${item.id}"]`
    ) as HTMLInputElement;
    if (checkbox) {
      if (checkbox.checked) {
        this.addToSelectedItems(item);
      } else {
        this.removeFromSelectedItems(item);
      }
    }
    // Cập nhật trạng thái của checkbox "Chọn tất cả"
    this.updateSelectAllCheckbox();
    console.log(this.selectedCartItems);
  }

  addToSelectedItems(item: CartItemResponse) {
    if (!this.selectedCartItems.includes(item)) {
      this.selectedCartItems.push(item);
      localStorage.setItem(
        'totalUniqueItems',
        this.totalUniqueItems.toString()
      );
    }
  }

  removeFromSelectedItems(item: CartItemResponse) {
    this.selectedCartItems = this.selectedCartItems.filter(
      (selectedCartItems) => selectedCartItems !== item
    );
    localStorage.setItem('totalUniqueItems', this.totalUniqueItems.toString());
  }

  updateSelectAllCheckbox() {
    const allChecked = this.cartResponse.every((item) => {
      const checkbox = document.querySelector(
        `input[name="item${item.id}"]`
      ) as HTMLInputElement;
      return checkbox ? checkbox.checked : false;
    });
    this.selectAll = allChecked;
  }
  confirmRemove(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.cartService.deleteCart(id).subscribe((data) => {
          this.cartResponse = this.cartResponse.filter(
            (item) => item.id !== id
          );
          this.selectedCartItems = this.selectedCartItems.filter(
            (item) => item.id !== id
          );
          localStorage.setItem(
            'totalUniqueItems',
            this.totalUniqueItems.toString()
          );
          this.showSuccess('Xóa sản phẩm thành công');
          location.reload();
        });
      },
    });
  }

  removeItem(id: number) {
    this.cartService.deleteCart(id).subscribe((data) => {
      this.cartResponse = this.cartResponse.filter((item) => item.id !== id);
      this.selectedCartItems = this.selectedCartItems.filter(
        (item) => item.id !== id
      );
      localStorage.setItem(
        'totalUniqueItems',
        this.totalUniqueItems.toString()
      );
      this.showSuccess('Xóa sản phẩm thành công');
      location.reload();
    });
  }
  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Có lỗi xảy ra',
      detail: message,
    });
  }
  showSuccess(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'thực hiện thành công',
      detail: message,
    });
  }
  processPayment(): void {
    if (this.selectedCartItems.length > 0) {
      for (let item of this.selectedCartItems) {
        const maxQuantity = item.productDetail.quantity;

        if (maxQuantity === undefined) {
          this.showError(`Không tìm thấy số lượng tồn kho của sản phẩm .`);
          return;
        }

        if (item.quantity > maxQuantity) {
          this.showError(
            `Số lượng của sản phẩm  vượt quá số lượng có sẵn (${maxQuantity}).`
          );
          return;
        }
      }
    }
    if (this.selectedCartItems.length > 0) {
      const totalAmount = this.totalAmount;
      console.log('Tổng tiền:', totalAmount); // Kiểm tra giá trị
      this.router.navigate(['/payment'], {
        queryParams: {
          totalAmount: totalAmount,
          listCartItem: JSON.stringify(this.selectedCartItems),
        },
      });
    } else {
      this.showError('Bạn chưa chọn sản phẩm để thanh toán');
    }
  }

  get totalAmount(): number {
    return this.selectedCartItems.reduce(
      (total, item) => total + item.productDetail.price * item.quantity,
      0
    );
  }
  get totalUniqueItems(): number {
    return this.cartResponse.length;
  }

  showDialog(item: CartItemResponse) {
    this.cartItem.id = item.id;
    this.cartItem.quantity = item.quantity;
    console.log(item);
    this.visible = true;
  }

  saveChanges() {
    const cartItem = this.cartResponse.find(
      (item) => item.id === this.cartItem.id
    );

    if (!cartItem) {
      this.showError('Sản phẩm không tồn tại trong giỏ hàng.');
      return;
    }

    // Ép kiểu thành number trước khi kiểm tra
    const quantity = Number(this.cartItem.quantity);

    if (isNaN(quantity)) {
      this.showError('Số lượng phải là một số hợp lệ');
      return;
    }

    if (quantity < 1) {
      this.showError('Số lượng phải lớn hơn hoặc bằng 1');
      return;
    }

    if (quantity > 10) {
      this.showError('Bạn chỉ được mua tối đa 10 sản phẩm!');
      return;
    }

    const maxQuantity = cartItem.productDetail.quantity;

    // Kiểm tra nếu số lượng mới vượt quá số lượng tồn kho
    if (quantity > maxQuantity) {
      this.showError(
        `Số lượng yêu cầu (${quantity}) vượt quá số lượng có sẵn (${maxQuantity}).`
      );
      return;
    }

    // Cập nhật giá trị mới
    this.cartItem.quantity = quantity;

    this.cartService.updateCartItem(this.cartItem).subscribe((data) => {
      location.reload();
    });
  }
}
