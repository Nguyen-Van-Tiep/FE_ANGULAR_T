// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { ConfirmationService, MessageService } from 'primeng/api';
// import { PaginationInfo } from 'src/app/commons/info/PaginationInfo';
// import { PaymentRequest } from 'src/app/commons/request/PaymentRequest';
// import { SaveCartRequest } from 'src/app/commons/request/SaveCartRequest';
// import { BaseResponse } from 'src/app/commons/response/BaseResposne';
// import { CartsResponse } from 'src/app/commons/response/CartsResponse';
// import { ErrorResponse } from 'src/app/commons/response/ErrorResponse';
// import { PaymentResponse } from 'src/app/commons/response/PaymentResponse';
// import { CartResult } from 'src/app/commons/result/CartResult';
// import { CartService } from 'src/app/service/cart/cart.service';
// import { PaymentService } from 'src/app/service/payment/payment.service';
// import { TokenStorageService } from 'src/app/service/tokenStorage/token-storage.service';

// @Component({
//   selector: 'app-cart-customer',
//   templateUrl: './cart-customer.component.html',
//   styleUrl: './cart-customer.component.css'
// })
// export class CartCustomerComponent implements OnInit {
//   activityValues: number[] = [0, 100];
//   selectedProduct: CartResult[];
//   response: CartsResponse;
//   loading: boolean = false;
//   searchValue!: string;
//   baseResponse: BaseResponse<any>;
//   messageResponse: string = '';
//   request: SaveCartRequest;
//   paymentRequest: PaymentRequest;
//   total: number = 0;
//   totalMoney: number = 0;
//   paymentResponse = new PaymentResponse();
//   error = new ErrorResponse();
//   username: string = '';
//   constructor(
//     private router: Router,
//     private cartService: CartService,
//     private messageService: MessageService,
//     private confirmationService: ConfirmationService,
//     private paymentService: PaymentService,
//     private tokenStorageService: TokenStorageService
//   ) {
//     this.response = new CartsResponse();
//     this.selectedProduct = [];
//     this.baseResponse = new BaseResponse();
//     this.response.pagination = new PaginationInfo();
//     this.request = new SaveCartRequest();
//     this.paymentRequest = new PaymentRequest();
//     this.paymentRequest.cartIds = [];
//   }

//   ngOnInit() {
//     this.username = this.tokenStorageService.getUsername();
//     this.getCart();
//   }
//   addQuanlity(product: CartResult) {
//     product.quantity += 1;
//     const index = this.selectedProduct.findIndex(x => x.detailCartId == product.detailCartId);
//     this.selectedProduct[index].quantity = product.quantity;
//     this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price * val.quantity, 0);
//     this.total = this.selectedProduct.length;
//     this.updateCart(product.detailCartId, product.quantity);
//     this.updateCart(product.detailCartId, product.quantity);
//   }

//   validatequanlity(product: CartResult) {
//     if (product.quantity < 1) {
//       product.quantity = 1; // Thiết lập lại giá trị là 1 nếu nhỏ hơn 1
//     }
//   }

//   removeQuanlity(product: CartResult) {
//     if (product.quantity > 1) {
//       product.quantity -= 1;
//       const index = this.selectedProduct.findIndex(x => x.detailCartId == product.detailCartId);
//       this.selectedProduct[index].quantity = product.quantity;
//       this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price * val.quantity, 0);
//       this.total = this.selectedProduct.length;
//       this.updateCart(product.detailCartId, product.quantity);
//     }
//   }

//   selectAllProducts(event: any) {
//     const isChecked = event.checked;
//     if (isChecked) {
//       this.selectedProduct = [...this.response.carts];
//     } else {
//       this.selectedProduct = [];
//     }

//     this.total = this.selectedProduct.length;
//     this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price * val.quantity, 0);
//   }

//   onRowSelect(event: any) {
//     this.selectedProduct.push(event.data);
//     this.total = this.selectedProduct.length;
//     this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price, 0);
//   }

//   onRowUnselect(event: any) {
//     this.selectedProduct = this.selectedProduct.filter(x => x.detailCartId !== event.data.detailCartId);
//     this.total = this.selectedProduct.length;
//     this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price, 0);
//   }

//   getCart() {
//     this.cartService.getCart(0, 1000, 'modifiedDate', 'DESC').subscribe(data => {
//       this.baseResponse = data as BaseResponse<any>;
//       this.response = this.baseResponse.data;
//     });
//   }

//   refresh() {
//     this.cartService.refreshCart().subscribe(data => {
//       this.baseResponse = data as BaseResponse<any>;
//       this.messageResponse = this.baseResponse.data;
//       this.showSuccess(this.messageResponse);
//       this.getCart();
//     }, error => {
//       this.showError(error.error.message);
//     }
//     );
//   }


//   showSuccess(message: string) {
//     this.messageService.add({ severity: 'success', summary: 'thực hiện thành công', detail: message });
//   }

//   showError(message: string) {
//     this.messageService.add({ severity: 'error', summary: 'Có lỗi xảy ra', detail: message });
//   }

//   updateCart(id: number, quantity: number) {
//     this.request.detailCartId = id;
//     this.request.quantity = quantity;
//     this.cartService.updateCart(this.request).subscribe(data => {
//       this.baseResponse = data as BaseResponse<any>;
//       this.messageResponse = this.baseResponse.data;
//       this.showSuccess(this.messageResponse);
//     }, error => {
//       this.showError(error.error.message);
//       this.getCart();
//     });
//   }

//   clear(table: any) {
//     table.clear();
//     this.searchValue = '';
//   }

//   removeProduct(event: Event, product: CartResult) {
//     this.confirmationService.confirm({
//       target: event.target as EventTarget,
//       message: 'bạn có chắc chắn muốn xóa sản phẩm này không?',
//       icon: 'pi pi-info-circle',
//       acceptButtonStyleClass: 'p-button-danger p-button-sm',
//       accept: () => {

//         const index = this.selectedProduct.findIndex(x => x.detailCartId == product.detailCartId);
//         this.selectedProduct.splice(index, 1);
//         this.totalMoney = this.selectedProduct.reduce((acc, val) => acc + val.price * val.quantity, 0);
//         this.total = this.selectedProduct.length;
//         this.cartService.deleteCart(product.detailCartId).subscribe(data => {
//           this.baseResponse = data as BaseResponse<any>;
//           this.messageResponse = this.baseResponse.data;
//           this.showSuccess(this.messageResponse);
//           this.getCart();
//         }, error => {
//           this.showError(error.error.message);
//         });
//       }
//     });
//   }

//   goToPayment() {
//     this.paymentRequest.addressCode = 1;
//     this.paymentRequest.code = 'code';
//     this.paymentRequest.paymentMethod = 'money';
//     this.paymentRequest.type = 'C';
//     this.paymentRequest.cartIds = this.selectedProduct.map(x => x.detailCartId);
//     this.paymentService.validatePayment(this.paymentRequest).subscribe(data => {
//       this.baseResponse = data as BaseResponse<PaymentResponse>;
//       this.paymentResponse = this.baseResponse.data;
//       this.tokenStorageService.saveCache(this.username, this.paymentResponse.code, 10);
//       console.log(this.username);
      
//       this.router.navigate(['/payment', this.paymentResponse.code]);
//     }, error => {
//       this.error = error.error as ErrorResponse;
//       this.showError(this.error.msgError);
//       this.paymentRequest = new PaymentRequest();
//       this.paymentRequest.cartIds = [];
//     }
//     );
//   }
// }
