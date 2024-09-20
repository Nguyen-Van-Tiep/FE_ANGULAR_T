import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SaveCartRequest } from 'src/app/commons/request/SaveCartRequest';
import { env } from 'src/app/environment/env';
import { CommonService } from '../common/common.service';
import { CartRequest } from 'src/app/commons/request/CartRequest';
import { CartItemResponse } from 'src/app/commons/response/CartItemResponse';
import { CartItemRequest } from 'src/app/commons/request/CartItemRequest';
const BASE_API = env.baseApi;
@Injectable({
  providedIn: 'root',
})
export class CartService {
  api = BASE_API + 'cart';

  constructor(private http: HttpClient, private commonService: CommonService) {}

  getCart(request: CartRequest) {
    return this.http.post(
      this.api + '/getCart',
      request,
      this.commonService.gethttpOptions()
    );
  }

  saveCart(request: CartRequest) {
    return this.http.post(
      this.api + '/save',
      request,
      this.commonService.gethttpOptions()
    );
  }

  deleteCart(id: number) {
    return this.http.delete(
      this.api + '/delete/' + id,
      this.commonService.gethttpOptions()
    );
  }

  updateCartItem(request: CartItemRequest) {
    return this.http.put(
      this.api + '/update',
      request,
      this.commonService.gethttpOptions()
    );
  }

  refreshCart() {
    return this.http.get(
      this.api + '/refresh',
      this.commonService.gethttpOptions()
    );
  }
}
