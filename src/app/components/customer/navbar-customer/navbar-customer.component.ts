import { Component, OnInit } from '@angular/core';
import { ProductsResponse } from 'src/app/commons/response/ProductsResponse';
import { ProductResult } from 'src/app/commons/result/ProductResult';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { BaseResponse } from 'src/app/commons/response/BaseResposne';
import { CartResposnse } from 'src/app/commons/response/CartResponse';
import { CartsResponse } from 'src/app/commons/response/CartsResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'navbar-customer',
  templateUrl: './navbar-customer.component.html',
  styleUrls: ['./navbar-customer.component.css'],
})
export class NavbarCustomerComponent implements OnInit {
  isLogin = false;
  isOpenCart = false;
  totalUniqueItems: number = 0;
  baseResponse: BaseResponse<any>;
  response: CartsResponse;
  total = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private messageService: MessageService
  ) {
    this.baseResponse = new BaseResponse();
    this.response = new CartsResponse();
  }
  ngOnInit() {
    this.isLogin = this.authService.isAuthenticated();
    const totalItems = localStorage.getItem('totalUniqueItems');
    if (totalItems) {
      this.totalUniqueItems = parseInt(totalItems, 10);
    }
  }

  goToSignInPage() {
    this.router.navigate(['/auth/login']);
  }

  goToSignUpPage() {
    this.router.navigate(['/auth/register']);
  }

  openCart() {
    this.isOpenCart = !this.isOpenCart;
    this.router.navigate(['/cart']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout(true);
    this.showSuccess('Đăng xuất thành công');
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

  goToFavorite() {
    if (!this.isLogin) {
      this.showError('Bạn cần đăng nhập để thực hiện chức năng này');
      return;
    }
    this.router.navigate(['/favorite']);
  }
}
